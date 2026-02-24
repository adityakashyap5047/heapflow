"use client";

import { cn } from "@/lib/utils"
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";
import type { Comment as PrismaComment, User } from "@prisma/client";
import { toast } from "sonner";
import { addComment, removeComment } from "@/actions/comments";

type CommentWithAuthor = PrismaComment & {
    author?: User;
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col space-y-2 overflow-hidden rounded-md border border-white/20 bg-slate-950 p-2",
                className
            )}
        >
            {children}
        </div>
    );
};

const Comments = ({
    comments: _comments,
    type,
    typeId,
    className,
}: {
    comments: CommentWithAuthor[];
    type: "question" | "answer";
    typeId: string;
    className?: string;
}) => {
    const [comments, setComments] = React.useState<CommentWithAuthor[]>(_comments);
    const [newComment, setNewComment] = React.useState("");
    const [error, setError] = React.useState("");
    
    const { data: session } = useSession();
    const user = session?.user as { id: string; name?: string } | undefined;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newComment || !user) {
            setError(() => "You must be logged in or provide a comment before submitting.");
            return;
        }

        try {
            const commentData = await addComment({
                content: newComment,
                type: type.toUpperCase() as "QUESTION" | "ANSWER",
                typeId: typeId,
            });
            if(!commentData || !commentData.success || !commentData.data) {
                toast.error(commentData?.message || "Error creating comment");
                return;
            }

            const data = commentData.data;

            setNewComment(() => "");
            setComments(prev => [
                { 
                    ...data, 
                    author: { id: user.id, name: user.name || "Anonymous" } as User 
                }, 
                ...prev
            ]);
            toast.success("Comment added successfully");
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Error creating comment");
            } else {
                toast.error("Error creating comment");
            }
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            const resonse = await removeComment(commentId);

            if(!resonse || !resonse.success) {
                toast.error(resonse?.message || "Error deleting comment");
                return;
            }
            setComments(prev => prev.filter(comment => comment.id !== commentId));
            toast.warning("Comment deleted successfully");
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Error deleting comment");
            } else {
                toast.error("Error deleting comment");
            }
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 pl-4", className)}>
            {comments?.map(comment => (
                <React.Fragment key={comment.id}>
                    <hr className="border-white/40" />
                    <div className="flex gap-2">
                        <p className="text-sm">
                            {comment.content} -{" "}
                            <Link
                                href={`/users/${comment.authorId}/${slugify(comment.author?.name || "Anonymous")}`}
                                className="text-orange-500 hover:text-orange-600"
                            >
                                {comment.author?.name || "Anonymous"}
                            </Link>{" "}
                            <span className="opacity-60">
                                {convertDateToRelativeTime(new Date(comment.createdAt))}
                            </span>
                        </p>
                        {user?.id === comment.authorId ? (
                            <button
                                onClick={() => deleteComment(comment.id)}
                                className="shrink-0 text-red-500 hover:text-red-600"
                            >
                                <IconTrash className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                </React.Fragment>
            ))}
            <hr className="border-white/40" />
            <form onSubmit={handleSubmit} className={error ? "flex flex-col gap-2 items-center" : "flex flex-col md:flex-row items-center gap-2"}>
                <textarea
                    className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
                    rows={1}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={e => setNewComment(() => e.target.value)}
                />
                {error && (
                    <LabelInputContainer>
                        <div className="text-center">
                            <span className="text-red-500">{error}</span>
                        </div>
                    </LabelInputContainer>
                )}
                <button className="w-3/4 md:w-auto shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                    Add Comment
                </button>
            </form>
        </div>
    );
};

export default Comments;