import Pagination from "@/components/Pagination";
import { db } from "@/lib/prisma";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import React from "react";
import { VoteStatus } from "@prisma/client";

interface PageProps {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string; voteStatus?: "upvoted" | "downvoted" }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const page = parseInt(resolvedSearchParams.page || "1");
    const limit = 25;
    const skip = (page - 1) * limit;

    const whereClause: {
        userId: string;
        status?: VoteStatus;
    } = {
        userId: resolvedParams.userId,
    };

    if (resolvedSearchParams.voteStatus) {
        whereClause.status = resolvedSearchParams.voteStatus as VoteStatus;
    }

    const [votes, total] = await Promise.all([
        db?.vote.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                question: {
                    select: { id: true, title: true },
                },
                answer: {
                    select: {
                        id: true,
                        question: {
                            select: { id: true, title: true },
                        },
                    },
                },
            },
        }),
        db?.vote.count({ where: whereClause }),
    ]);

    return (
        <div className="px-4">
            <div className="mb-4 flex justify-between">
                <p>{total} votes</p>
                <ul className="flex gap-1">
                    <li>
                        <Link
                            href={`/users/${resolvedParams.userId}/${resolvedParams.userSlug}/votes`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                !resolvedSearchParams.voteStatus ? "bg-white/20" : "hover:bg-white/20"
                            }`}
                        >
                            All
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${resolvedParams.userId}/${resolvedParams.userSlug}/votes?voteStatus=upvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                resolvedSearchParams.voteStatus === "upvoted"
                                    ? "bg-white/20"
                                    : "hover:bg-white/20"
                            }`}
                        >
                            Upvotes
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${resolvedParams.userId}/${resolvedParams.userSlug}/votes?voteStatus=downvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                resolvedSearchParams.voteStatus === "downvoted"
                                    ? "bg-white/20"
                                    : "hover:bg-white/20"
                            }`}
                        >
                            Downvotes
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {votes?.map((vote) => {
                    const questionData =
                        vote.type === "QUESTION"
                            ? vote.question
                            : vote.answer?.question;

                    if (!questionData) return null;

                    return (
                        <div
                            key={vote.id}
                            className="rounded-xl border border-white/40 p-4 duration-200 hover:bg-white/10"
                        >
                            <div className="flex">
                                <p className="mr-4 shrink-0">{vote.status}</p>
                                <p>
                                    <Link
                                        href={`/questions/${questionData.id}/${slugify(questionData.title)}`}
                                        className="text-orange-500 hover:text-orange-600"
                                    >
                                        {questionData.title}
                                    </Link>
                                </p>
                            </div>
                            <p className="text-right text-sm">
                                {convertDateToRelativeTime(new Date(vote.createdAt))}
                            </p>
                        </div>
                    );
                })}
            </div>
            <Pagination total={total || 0} limit={limit} currentPage={page} />
        </div>
    );
};

export default Page;