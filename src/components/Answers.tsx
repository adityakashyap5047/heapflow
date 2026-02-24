"use client";

import Comments from "./Comments";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { IconTrash } from "@tabler/icons-react";
import VoteButtons from "./VoteButtons";
import { cn } from "@/lib/utils";
import RTE, { MarkdownPreview } from "./RTE";
import { useSession } from "next-auth/react";
import type { Answer as PrismaAnswer, User, Vote, Comment } from "@prisma/client";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { addAnswer, deleteAnswer } from "@/actions/answers";

type AnswerWithRelations = PrismaAnswer & {
    author: User;
    votes: Vote[];
    comments: Comment[];
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

const Answers = ({
    answers: _answers,
    questionId,
}: {
    answers: AnswerWithRelations[];
    questionId: string;
}) => {
    const [answers, setAnswers] = useState<AnswerWithRelations[]>(_answers);
    const [newAnswer, setNewAnswer] = useState("");
    const [error, setError] = useState("");

    const { data: session } = useSession();
    
    const user = session?.user as { id: string; name?: string; reputation?: number } | undefined;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newAnswer || !user){
            setError(() => "You must be logged in or provide an answer before submitting.");
            return;
        }

        try {
            const answerData = await addAnswer({questionId, content: newAnswer});
            if(!answerData || !answerData.success || !answerData.data) {
                toast.error(answerData?.message || "Error creating answer");
                return;
            }
            const answer = answerData.data.answer;
            const updatedUser = answerData.data.updatedUser;
            const newReputation = updatedUser?.reputation || 0;
            setNewAnswer(() => "");
            setAnswers(prev => [
                {
                    ...answer,
                    author: {
                        id: user.id,
                        name: user.name || "Anonymous",
                        reputation: newReputation,
                    } as User,
                    votes: [],
                    comments: [],
                },
                ...prev.map(a => 
                    a.authorId === user.id 
                        ? { ...a, author: { ...a.author, reputation: newReputation } }
                        : a
                ),
            ]);
            toast.success("Answer created successfully");
        } catch (error) {
            if (error instanceof Error) {
                toast.warning(error.message || "Error creating answer");
            } else {
                toast.warning("Error creating answer");
            }
        }
    };

    const deleteAnswerFn = async (answerId: string) => {
        try {
            const response = await deleteAnswer(answerId);

            if(!response || !response.success || !response.data) {
                toast.error(response?.message || "Error deleting answer");
                return;
            }

            const updatedUser = response.data.updatedUser;
            const newReputation = updatedUser?.reputation || 0;

            setAnswers(prev => prev
                .filter(answer => answer.id !== answerId)
                .map(a => 
                    a.authorId === user?.id 
                        ? { ...a, author: { ...a.author, reputation: newReputation } }
                        : a
                )
            );
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Error deleting answer");
            } else {
                toast.error("Error deleting answer");
            }
        }
    };

    return (
        <>
            <h2 className="mb-4 text-xl">{answers?.length} Answers</h2>
            {answers.map(answer => (
                <div key={answer.id} className="flex gap-4">
                    <div className="flex shrink-0 flex-col items-center gap-4">
                        <VoteButtons
                            type="answer"
                            id={answer.id}
                            upvotes={answer.votes.filter(v => v.status === "upvoted")}
                            downvotes={answer.votes.filter(v => v.status === "downvoted")}
                        />
                        {user?.id === answer.authorId ? (
                            <button
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
                                onClick={() => deleteAnswerFn(answer.id)}
                            >
                                <IconTrash className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                    <div className="w-full overflow-auto">
                        <MarkdownPreview className="rounded-xl p-4" source={answer.content} />
                        <div className="mt-4 flex items-center justify-end gap-1">
                            <picture>
                                {answer.author.avatarUrl ?
                                    <Image
                                        src={answer.author.avatarUrl}
                                        height={40}
                                        width={40}
                                        alt={answer.author.name}
                                        className="rounded-lg"
                                    /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm">
                                    {answer.author.name ? slugify(answer.author.name).slice(0, 2).toUpperCase() : "A"}
                                </div>}
                            </picture>
                            <div className="block leading-tight">
                                <Link
                                    href={`/users/${answer.author.id}/${slugify(answer.author.name)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {answer.author.name}
                                </Link>
                                <p>
                                    <strong>{answer.author.reputation}</strong>
                                </p>
                            </div>
                        </div>
                        <Comments
                            comments={answer.comments}
                            className="mt-4"
                            type="answer"
                            typeId={answer.id}
                        />
                        <hr className="my-4 border-white/40" />
                    </div>
                </div>
            ))}
            <hr className="my-4 border-white/40" />
            <form onSubmit={handleSubmit} className="space-y-2">
                <h2 className="mb-4 text-xl">Your Answer</h2>
                <RTE value={newAnswer} onChange={value => setNewAnswer(() => value || "")} />
                {error && (
                    <LabelInputContainer>
                        <div className="text-center">
                            <span className="text-red-500">{error}</span>
                        </div>
                    </LabelInputContainer>
                )}
                <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                    Post Your Answer
                </button>
            </form>
        </>
    );
};


export default Answers;