"use server";

import { db } from "@/lib/prisma";
import { authOptions } from "@/store/Auth";
import { getServerSession } from "next-auth";

type VoteType = {
    questionId: string;
    type: "QUESTION" | "ANSWER";
    status: "upvoted" | "downvoted"
}

export async function getVote({questionId, type, status}: VoteType){
    try {
        const vote = await db?.vote.findMany({
            where: {
                typeId: questionId,
                type,
                status,
            },
            take: 1,
        });

        if (!vote || vote.length === 0) {
            return {success: false, message: "Vote not found"};
        }

        return {success: true, data: vote};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to get vote: ${error.message}` : "Failed to get vote"};
    }
}

export async function getVotesByUserId({questionId, type}: { questionId: string; type: "QUESTION" | "ANSWER"; }){
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
        const vote = await db?.vote.findMany({
            where: {
                typeId: questionId,
                type,
                userId: existingUser.id,
            },
        });

        if (!vote || vote.length === 0) {
            return {success: false, message: "Vote not found"};
        }

        return {success: true, data: vote};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to get vote: ${error.message}` : "Failed to get vote"};
    }
}

type UpdateVoteType = {
    typeId: string;
    type: "QUESTION" | "ANSWER";
    voteStatus: "upvoted" | "downvoted";
}

export async function updateVote({ typeId, type, voteStatus }: UpdateVoteType) {
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
            where: { id: user.id },
        });

        if (!existingUser) {
            return { success: false, message: "User not found" };
        }

        // Find existing vote by this user
        const existingVote = await db?.vote.findFirst({
            where: {
                type,
                typeId,
                userId: existingUser.id,
            },
        });

        // Get the question or answer to find the author
        const questionOrAnswer = type === "QUESTION"
            ? await db?.question.findUnique({ where: { id: typeId } })
            : await db?.answer.findUnique({ where: { id: typeId } });

        if (!questionOrAnswer) {
            return { success: false, message: `${type === "QUESTION" ? "Question" : "Answer"} not found` };
        }

        const authorId = questionOrAnswer.authorId;

        // If a vote exists, delete it and adjust reputation
        if (existingVote) {
            await db?.vote.delete({
                where: { id: existingVote.id },
            });

            // Adjust reputation: remove the effect of the old vote
            await db?.user.update({
                where: { id: authorId },
                data: {
                    reputation: {
                        increment: existingVote.status === "upvoted" ? -1 : 1,
                    },
                },
            });
        }

        // If previous vote status is different from new status (or no previous vote), create new vote
        if (existingVote?.status !== voteStatus) {
            const newVote = await db?.vote.create({
                data: {
                    type,
                    typeId,
                    status: voteStatus,
                    userId: existingUser.id,
                    questionId: type === "QUESTION" ? typeId : null,
                    answerId: type === "ANSWER" ? typeId : null,
                },
            });

            // Adjust reputation based on the new vote
            if (existingVote) {
                // Previous vote existed, so we already removed its effect
                // Now apply the new vote effect
                await db?.user.update({
                    where: { id: authorId },
                    data: {
                        reputation: {
                            increment: voteStatus === "upvoted" ? 1 : -1,
                        },
                    },
                });
            } else {
                // No previous vote, just apply the new vote effect
                await db?.user.update({
                    where: { id: authorId },
                    data: {
                        reputation: {
                            increment: voteStatus === "upvoted" ? 1 : -1,
                        },
                    },
                });
            }

            // Get vote counts and updated author reputation
            const [upvotes, downvotes, updatedAuthor] = await Promise.all([
                db?.vote.count({
                    where: { type, typeId, status: "upvoted" },
                }),
                db?.vote.count({
                    where: { type, typeId, status: "downvoted" },
                }),
                db?.user.findUnique({
                    where: { id: authorId },
                    select: { id: true, reputation: true },
                }),
            ]);

            return {
                success: true,
                data: {
                    document: newVote,
                    voteResult: (upvotes ?? 0) - (downvotes ?? 0),
                    voteCountDelta: existingVote ? 0 : 1, // +1 if new vote, 0 if changed
                    authorId,
                    authorReputation: updatedAuthor?.reputation ?? 0,
                },
                message: existingVote ? "Vote Status Updated" : "Voted",
            };
        }

        // Vote was removed (same status clicked again - toggle off)
        const [upvotes, downvotes, updatedAuthor] = await Promise.all([
            db?.vote.count({
                where: { type, typeId, status: "upvoted" },
            }),
            db?.vote.count({
                where: { type, typeId, status: "downvoted" },
            }),
            db?.user.findUnique({
                where: { id: authorId },
                select: { id: true, reputation: true },
            }),
        ]);

        return {
            success: true,
            data: {
                document: null,
                voteResult: (upvotes ?? 0) - (downvotes ?? 0),
                voteCountDelta: -1, // Vote was removed
                authorId,
                authorReputation: updatedAuthor?.reputation ?? 0,
            },
            message: "Vote removed",
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? `Failed to update vote: ${error.message}` : "Failed to update vote",
        };
    }
}