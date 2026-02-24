import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/question/QuestionCard";
import { db } from "@/lib/prisma";
import React from "react";

interface PageProps {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const page = parseInt(resolvedSearchParams.page || "1");
    const limit = 25;
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
        db?.question.findMany({
            where: { authorId: resolvedParams.userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                author: true,
                votes: true,
                answers: true,
            },
        }),
        db?.question.count({ where: { authorId: resolvedParams.userId } }),
    ]);

    return (
        <div className="px-4">
            <div className="mb-4">
                <p>{total} questions</p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {questions?.map((ques) => (
                    <QuestionCard key={ques.id} ques={ques} />
                ))}
            </div>
            <Pagination total={total || 0} limit={limit} currentPage={page} />
        </div>
    );
};

export default Page;