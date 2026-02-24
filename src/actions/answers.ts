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
            }
        });

        if(answer?.authorId !== existingUser.id) {
            return {success: false, message: "You are not authorized to delete this answer"};
        }

        const deletedAnswer = await db?.answer.delete({
            where: {
                id: answerId,
            },
        });

        const updatedUser = await db?.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                reputation: Math.max(0, (existingUser.reputation || 0) - 1),
            },
        });

        return {success: true, message: "Answer deleted successfully", data: {deletedAnswer, updatedUser}};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to delete answer: ${error.message}` : "Failed to delete answer"};
    }
}