"use server";

import { db } from "@/lib/prisma";
import { authOptions } from "@/store/Auth";
import { getServerSession } from "next-auth";

type CommentType = {
    questionId: string;
    type: "QUESTION" | "ANSWER";
}

export async function getComments({questionId, type}: CommentType){
    try {
        const comments = await db?.comment.findMany({
            where: {
                typeId: questionId,
                type,
            },
            include: {
                author: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!comments || comments.length === 0) {
            return {success: false, message: "Comments not found"};
        }

        return {success: true, data: comments};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to get comments: ${error.message}` : "Failed to get comments"};
    }
}

export async function addComment({typeId, content, type}: {typeId: string; content: string; type: "QUESTION" | "ANSWER";}){
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

        const comment = await db?.comment.create({
            data: {
                content,
                typeId,
                type,
                authorId: existingUser.id,
            }
        });

        return {success: true, message: "Comment created successfully", data: comment};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to create comment: ${error.message}` : "Failed to create comment"};
    }
}

export async function removeComment(commentId: string) {
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

        const comment = await db?.comment.findUnique({
            where: {
                id: commentId,
            },
            include: {
                author: true,
            }
        });

        if(!comment){
            return {success: false, message: "Comment not found"};
        }

        if(comment?.authorId !== existingUser.id) {
            return {success: false, message: "You are not authorized to delete this comment"};
        }

        const deletedComment = await db?.comment.delete({
            where: {
                id: commentId,
            },
        });

        return {success: true, message: "Comment deleted successfully", data: deletedComment};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to delete comment: ${error.message}` : "Failed to delete comment"};
    }
}