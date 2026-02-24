import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import { IconClockFilled, IconUserFilled } from "@tabler/icons-react";
import { db } from "@/lib/prisma";
import Image from "next/image";
import slugify from "@/utils/slugify";
import EditButton from "./EditButton";
import Navbar from "./Navbar";

interface PageProps {
    params: Promise<{ userId: string; userSlug: string }>;
    children: React.ReactNode;
}

const Layout = async ({
    children,
    params,
}: PageProps) => {
    const resolvedParams = await params;
    const user = await db.user.findUnique({
        where: { id: resolvedParams.userId },
    });

    return (
        <div className="container mx-auto space-y-4 px-4 pb-20 pt-32">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="w-40 shrink-0">
                    <picture className="block w-full">
                        {user?.avatarUrl ?
                            <Image
                                src={user?.avatarUrl}
                                height={40}
                                width={40}
                                alt={user?.name}
                                className="h-full w-full rounded-xl object-cover"
                            /> : <div className="h-30 w-40 rounded-xl object-cover flex items-center justify-center bg-white/20 text-sm">
                                {user?.name ? slugify(user?.name).slice(0, 2).toUpperCase() : "A"}
                            </div>}
                    </picture>
                </div>
                <div className="w-full">
                    <div className="flex items-start justify-between">
                        <div className="block space-y-0.5">
                            <h1 className="text-3xl font-bold">{user?.name}</h1>
                            <p className="text-lg text-gray-500">{user?.email}</p>
                            <p className="flex items-center gap-1 text-sm font-bold text-gray-500">
                                <IconUserFilled className="w-4 shrink-0" /> Dropped{" "}
                                {user?.createdAt ? convertDateToRelativeTime(new Date(user.createdAt)) : "Unknown"},
                            </p>
                            <p className="flex items-center gap-1 text-sm text-gray-500">
                                <IconClockFilled className="w-4 shrink-0" /> Last activity&nbsp;
                                {user?.updatedAt ? convertDateToRelativeTime(new Date(user.updatedAt)) : "Unknown"}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <EditButton />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
                <Navbar />
                <div className="w-full">{children}</div>
            </div>
        </div>
    );
};

export default Layout;