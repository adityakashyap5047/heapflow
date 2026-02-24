"use client";

import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
import { getVotesByUserId, updateVote } from "@/actions/votes";
import { useReputation } from "@/store/ReputationContext";
import { useQuestionStatsOptional } from "@/store/QuestionStatsContext";
import type { Vote as PrismaVote } from "@prisma/client";
import { toast } from "sonner";

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: PrismaVote[];
    downvotes: PrismaVote[];
    className?: string;
}) => {
    const [votedDocument, setVotedDocument] = React.useState<PrismaVote | null>(); // undefined means not fetched yet
    const [voteResult, setVoteResult] = React.useState<number>((upvotes?.length || 0) - (downvotes?.length || 0));

    const {data: session} = useSession();
    const user = session?.user as { id: string } | undefined;
    const router = useRouter();
    const { updateReputation } = useReputation();
    const questionStats = useQuestionStatsOptional();
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            if (user) {
                const voteData = await getVotesByUserId({ questionId: id, type: type.toUpperCase() as "QUESTION" | "ANSWER" });
                const votes = voteData.success ? voteData.data : [];
                setVotedDocument(() => votes ? votes[0] || null : null);
            }
        })();
    }, [user, id, type]);

    const toggleUpvote = async () => {
        if (!user) return router.push("/login");
        if (votedDocument === undefined || isLoading) return;

        setIsLoading(true);
        try {
            const result = await updateVote({
                typeId: id,
                type: type.toUpperCase() as "QUESTION" | "ANSWER",
                voteStatus: "upvoted",
            });

            if (!result.success) {
                throw new Error(result.message);
            }

            setVoteResult(result.data?.voteResult ?? 0);
            setVotedDocument(result.data?.document ?? null);
            
            // Sync reputation globally
            if (result.data?.authorId) {
                updateReputation(result.data.authorId, result.data.authorReputation);
            }
            
            // Sync vote count for questions only
            if (type === "question" && result.data?.voteCountDelta !== undefined) {
                questionStats?.updateVoteCount(result.data.voteCountDelta);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Error voting");
            } else {
                toast.error(String(error) || "Error voting");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDownvote = async () => {
        if (!user) return router.push("/login");
        if (votedDocument === undefined || isLoading) return;

        setIsLoading(true);
        try {
            const result = await updateVote({
                typeId: id,
                type: type.toUpperCase() as "QUESTION" | "ANSWER",
                voteStatus: "downvoted",
            });

            if (!result.success) {
                throw new Error(result.message);
            }

            setVoteResult(result.data?.voteResult ?? 0);
            setVotedDocument(result.data?.document ?? null);
            
            // Sync reputation globally
            if (result.data?.authorId) {
                updateReputation(result.data.authorId, result.data.authorReputation);
            }
            
            // Sync vote count for questions only
            if (type === "question" && result.data?.voteCountDelta !== undefined) {
                questionStats?.updateVoteCount(result.data.voteCountDelta);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Error voting");
            } else {
                toast.error(String(error) || "Error voting");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.status === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={toggleUpvote}
                disabled={isLoading}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteResult}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.status === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={toggleDownvote}
                disabled={isLoading}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;