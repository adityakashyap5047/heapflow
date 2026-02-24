"use server";

import { db } from "@/lib/prisma";
import { authOptions } from "@/store/Auth";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";

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
        });

        if (!question) {
            return {success: false, message: "Question not found or you are not the author"};
        }

        await db?.question.delete({
            where: {
                id: questionId,
            },
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