"use client";

import { useReputation } from "@/store/ReputationContext";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import slugify from "@/utils/slugify";

interface Author {
    id: string;
    name: string;
    avatarUrl?: string | null;
    reputation: number;
}

interface UserReputationDisplayProps {
    author: Author | null;
}

export default function UserReputationDisplay({ author }: UserReputationDisplayProps) {
    const { getReputation, initializeReputations } = useReputation();

    useEffect(() => {
        if (author) {
            initializeReputations([{ id: author.id, reputation: author.reputation }]);
        }
    }, [author, initializeReputations]);

    if (!author) {
        return null;
    }

    const displayReputation = getReputation(author.id, author.reputation);

    return (
        <div className="mt-4 flex items-center justify-end gap-1">
            <picture>
                {author.avatarUrl && author.avatarUrl !== "" ? (
                    <Image
                        src={author.avatarUrl}
                        height={40}
                        width={40}
                        alt={author.name}
                        className="rounded-lg"
                    />
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm">
                        {author.name ? slugify(author.name).slice(0, 2).toUpperCase() : "U"}
                    </div>
                )}
            </picture>
            <div className="block leading-tight">
                <Link
                    href={`/users/${author.id}/${slugify(author.name ?? "")}`}
                    className="text-orange-500 hover:text-orange-600"
                >
                    {author.name ?? "Unknown User"}
                </Link>
                <p>
                    <strong>{displayReputation}</strong>
                </p>
            </div>
        </div>
    );
}
