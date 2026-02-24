import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { db } from "@/lib/prisma";
import slugify from "@/utils/slugify";
import Link from "next/link";
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

    const [answers, total] = await Promise.all([
        db?.answer.findMany({
            where: { authorId: resolvedParams.userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                question: {
                    select: { id: true, title: true },
                },
            },
        }),
        db?.answer.count({ where: { authorId: resolvedParams.userId } }),
    ]);

    return (
        <div className="px-4">
            <div className="mb-4">
                <p>{total} answers</p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {answers?.map((ans) => (
                    <div key={ans.id}>
                        <div className="max-h-40 overflow-auto">
                            <MarkdownPreview source={ans.content} className="rounded-lg p-4" />
                        </div>
                        <Link
                            href={`/questions/${ans.question.id}/${slugify(ans.question.title)}`}
                            className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                        >
                            Question
                        </Link>
                    </div>
                ))}
            </div>
            <Pagination total={total || 0} limit={limit} currentPage={page} />
        </div>
    );
};

export default Page;