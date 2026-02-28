"use server";

import { db } from "@/lib/prisma";
import { authOptions } from "@/store/Auth";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

type QuestionType = {
    title: string;
    content: string;
    tags: string[];
    imageUrl: string;
}

export async function createQuestion(question: QuestionType) {
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return {success: false, message: "Unauthorized"};
        }
        const user = session?.user as { id: string } | undefined;

        if (!user) {
            return {success: false, message: "Unauthorized"};
        }

        const existingUser = await db?.user.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!existingUser) {
            return {success: false, message: "User not found"};
        }

        const newQuestion = await db?.question.create({
            data: {
                title: question.title,
                content: question.content,
                authorId: existingUser.id,
                imageUrl: question.imageUrl,
                tags: question.tags,
            },
        });

        return {success: true, data: newQuestion};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to create question: ${error.message}` : "Failed to create question"};
    }
}

type GetQuestionsParams = {
    page?: number;
    limit?: number;
    tag?: string;
    search?: string;
};

export async function getQuestions({ page = 1, limit = 10, tag, search }: GetQuestionsParams = {}) {
    noStore();
    try {
        const skip = (page - 1) * limit;

        const where: Prisma.QuestionWhereInput = {};

        if (tag) {
            where.tags = { has: tag };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ];
        }

        const [questions, total] = await Promise.all([
            db?.question.findMany({
                where,
                include: {
                    author: true,
                    votes: true,
                    answers: true,
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            db?.question.count({ where }),
        ]);

        return {
            success: true,
            data: {
                questions: questions || [],
                total: total || 0,
                page,
                limit,
                totalPages: Math.ceil((total || 0) / limit),
            },
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? `Failed to fetch questions: ${error.message}` : "Failed to fetch questions",
        };
    }
}

export async function getQuestionById(questionId: string) {
    try {
        const question = await db?.question.findUnique({
            where: {
                id: questionId,
            },
            include: {
                author: true,
                answers: {
                    include: {
                        author: true,
                        votes: true,
                        comments: {
                            include: {
                                author: true,
                            },
                        },
                    },
                },
            },
        });

        if (!question) {
            return {success: false, message: "Question not found"};
        }

        return {success: true, data: question};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to get question: ${error.message}` : "Failed to get question"};
    }
}

export async function deleteQuestion(questionId: string) {
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return {success: false, message: "Unauthorized"};
        }
        const user = session?.user as { id: string } | undefined;

        if (!user) {
            return {success: false, message: "Unauthorized"};
        }

        const existingUser = await db?.user.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!existingUser) {
            return {success: false, message: "User not found"};
        }

        const question = await db?.question.findUnique({
            where: {
                id: questionId,
                authorId: existingUser.id,
            },
            include: {
                answers: {
                    include: {
                        votes: true,
                    },
                },
                votes: true,
            },
        });
        if (!question) {
            return {success: false, message: "Question not found or you are not the author"};
        }

        // Use a transaction to ensure all operations succeed or fail together
        await db?.$transaction(async (tx) => {
            // Track reputation adjustments by user
            const reputationAdjustments: Map<string, number> = new Map();

            // 1. Handle votes on the question - adjust question author's reputation
            for (const vote of question.votes) {
                const adjustment = vote.status === "upvoted" ? -1 : 1;
                const currentAdjustment = reputationAdjustments.get(question.authorId) || 0;
                reputationAdjustments.set(question.authorId, currentAdjustment + adjustment);
            }

            // 2. Handle answers and their related data
            for (const answer of question.answers) {
                // Handle votes on answers - adjust answer author's reputation
                for (const vote of answer.votes) {
                    const adjustment = vote.status === "upvoted" ? -1 : 1;
                    const currentAdjustment = reputationAdjustments.get(answer.authorId) || 0;
                    reputationAdjustments.set(answer.authorId, currentAdjustment + adjustment);
                }

                // Decrease reputation for answer author (they lose reputation for their answer)
                const currentAdjustment = reputationAdjustments.get(answer.authorId) || 0;
                reputationAdjustments.set(answer.authorId, currentAdjustment - 1);

                // Delete votes on this answer
                await tx.vote.deleteMany({
                    where: { answerId: answer.id },
                });

                // Delete comments on this answer
                await tx.comment.deleteMany({
                    where: { answerId: answer.id },
                });
            }

            // 3. Delete all answers for this question
            await tx.answer.deleteMany({
                where: { questionId },
            });

            // 4. Delete votes on the question
            await tx.vote.deleteMany({
                where: { questionId },
            });

            // 5. Delete comments on the question
            await tx.comment.deleteMany({
                where: { questionId },
            });

            // 6. Apply all reputation adjustments
            for (const [userId, adjustment] of reputationAdjustments) {
                if (adjustment !== 0) {
                    await tx.user.update({
                        where: { id: userId },
                        data: {
                            reputation: {
                                increment: adjustment,
                            },
                        },
                    });
                }
            }

            // Ensure reputation doesn't go below 0
            await tx.user.updateMany({
                where: {
                    reputation: { lt: 0 },
                },
                data: {
                    reputation: 0,
                },
            });

            // 7. Finally delete the question
            await tx.question.delete({
                where: { id: questionId },
            });
        });

        return {success: true, data: {message: "Question deleted successfully", status: 200}};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to delete question: ${error.message}` : "Failed to delete question"};
    }
}

type UpdateQuestionType = {
    questionId: string;
    title: string;
    content: string;
    tags: string[];
    imageUrl?: string;
}

export async function updateQuestion(data: UpdateQuestionType) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const user = session?.user as { id: string } | undefined;
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        const existingUser = await db?.user.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!existingUser) {
            return { success: false, message: "User not found" };
        }

        const question = await db?.question.findUnique({
            where: {
                id: data.questionId,
                authorId: existingUser.id,
            },
        });

        if (!question) {
            return { success: false, message: "Question not found or you are not the author" };
        }

        const updateData: {
            title: string;
            content: string;
            tags: string[];
            imageUrl?: string;
        } = {
            title: data.title,
            content: data.content,
            tags: data.tags,
        };

        if (data.imageUrl !== undefined) {
            updateData.imageUrl = data.imageUrl;
        }

        const updatedQuestion = await db?.question.update({
            where: {
                id: data.questionId,
            },
            data: updateData,
        });

        return { success: true, data: updatedQuestion };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? `Failed to update question: ${error.message}` : "Failed to update question"
        };
    }
}