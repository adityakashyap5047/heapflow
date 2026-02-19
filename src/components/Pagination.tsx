"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
    total: number;
    limit: number;
    currentPage: number;
}

const Pagination = ({ total, limit, currentPage }: PaginationProps) => {
    const searchParams = useSearchParams();
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `?${params.toString()}`;
    };

    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const showEllipsisStart = currentPage > 3;
        const showEllipsisEnd = currentPage < totalPages - 2;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (showEllipsisStart) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (showEllipsisEnd) {
                pages.push("...");
            }

            if (!pages.includes(totalPages)) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {currentPage > 1 && (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm duration-200 hover:bg-white/10"
                >
                    Previous
                </Link>
            )}

            {getVisiblePages().map((page, index) =>
                typeof page === "string" ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                        {page}
                    </span>
                ) : (
                    <Link
                        key={page}
                        href={createPageUrl(page)}
                        className={`rounded-lg border px-3 py-2 text-sm duration-200 ${
                            currentPage === page
                                ? "border-orange-500 bg-orange-500/20 text-orange-500"
                                : "border-white/20 hover:bg-white/10"
                        }`}
                    >
                        {page}
                    </Link>
                )
            )}

            {currentPage < totalPages && (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm duration-200 hover:bg-white/10"
                >
                    Next
                </Link>
            )}
        </div>
    );
};

export default Pagination;
