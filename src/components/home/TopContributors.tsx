import { cn } from "@/lib/utils";

import convertDateToRelativeTime from "@/utils/relativeTime";
import { AnimatedList } from "@/components/magicui/animated-list";
import Image from "next/image";
import type { User as PrismaUser } from "@prisma/client";
import slugify from "@/utils/slugify";
import { getTopContributors } from "@/actions/users";

const Notification = ({ user }: { user: PrismaUser }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-100 transform cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                // dark styles
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <picture>
                    {user?.avatarUrl ?
                        <Image
                            src={user?.avatarUrl}
                            height={40}
                            width={40}
                            alt={user?.name}
                            className="rounded-lg"
                        /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-sm">
                            {user?.name ? slugify(user?.name).slice(0, 2).toUpperCase() : "A"}
                        </div>}
                </picture>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                        <span className="text-sm sm:text-lg">{user.name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">
                            {convertDateToRelativeTime(new Date(user.updatedAt))}
                        </span>
                    </figcaption>
                    <p className="text-sm font-normal dark:text-white/60">
                        <span>Reputation</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{user.reputation}</span>
                    </p>
                </div>
            </div>
        </figure>
    );
};

export default async function TopContributers() {
    const result = await getTopContributors();
    const topUsers = result.success && result.data ? result.data : [];

    return (
        <div className="flex">
            <div className="relative flex max-h-100 min-h-100 w-full max-w-lg flex-col overflow-hidden rounded-lg p-6 shadow-lg">
                <AnimatedList>
                    {topUsers.slice(0, 4).map((user: PrismaUser) => (
                        <Notification user={user} key={user.id} />
                    ))}
                </AnimatedList>
            </div>
            <div className="hidden lg:hidden relative sm:flex max-h-100 min-h-100 w-full max-w-lg flex-col overflow-hidden rounded-lg p-6 shadow-lg">
                <AnimatedList>
                    {topUsers.slice(4).map((user: PrismaUser) => (
                        <Notification user={user} key={user.id} />
                    ))}
                </AnimatedList>
            </div>
        </div>
    );
}