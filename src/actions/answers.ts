"use server"

import { db } from "@/lib/prisma";
import { authOptions } from "@/store/Auth";
import { getServerSession } from "next-auth";

export async function addAnswer({questionId, content}: {questionId: string; content: string}){
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

        const answer = await db?.answer.create({
            data: {
                content,
                questionId,
                authorId: existingUser.id,
            },
        });

        const updatedUser = await db?.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                reputation: (existingUser.reputation || 0) + 1,
            },
        });

        return {success: true, message: "Answer created successfully", data: {answer, updatedUser}};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to create answer: ${error.message}` : "Failed to create answer"};
    }
}

export async function deleteAnswer(answerId: string) {
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

        const answer = await db?.answer.findUnique({
            where: {
                id: answerId,
            },
            include: {
                author: true,
                votes: true,
            }
        });

        if(!answer){
            return {success: false, message: "Answer not found"};
        }

        if(answer?.authorId !== existingUser.id) {
            return {success: false, message: "You are not authorized to delete this answer"};
        }

        // Use a transaction to ensure all operations succeed or fail together
        const result = await db?.$transaction(async (tx) => {
            // Calculate reputation adjustment from votes
            let reputationAdjustment = -1; // -1 for losing the answer itself
            
            for (const vote of answer.votes) {
                // Reverse the vote effect
                reputationAdjustment += vote.status === "upvoted" ? -1 : 1;
            }

            // Delete votes on this answer
            await tx.vote.deleteMany({
                where: { answerId },
            });

            // Delete comments on this answer
            await tx.comment.deleteMany({
                where: { answerId },
            });

            // Delete the answer
            const deletedAnswer = await tx.answer.delete({
                where: {
                    id: answerId,
                },
            });

            // Update author's reputation
            const updatedUser = await tx.user.update({
                where: {
                    id: existingUser.id,
                },
                data: {
                    reputation: Math.max(0, (existingUser.reputation || 0) + reputationAdjustment),
                },
            });

            return { deletedAnswer, updatedUser };
        });

        return {success: true, message: "Answer deleted successfully", data: result};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to delete answer: ${error.message}` : "Failed to delete answer"};
    }
}