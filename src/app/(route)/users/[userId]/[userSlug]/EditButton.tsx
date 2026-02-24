"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const EditButton = () => {
    const { userId, userSlug } = useParams();
    const {data: session} = useSession();

    const user = session?.user as { id: string } | undefined;

    if(!user || user?.id !== userId){
        return null;
    }

    return (
        <Link
            href={`/users/${userId}/${userSlug}/edit`}
            className="relative rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-black dark:border-white/20 dark:text-white"
        >
            <span>Edit</span>
            <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-linear-to-r from-transparent via-blue-500 to-transparent" />
        </Link>
    );
};

export default EditButton;