"use client";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
import { useSession } from 'next-auth/react';
import slugify from "@/utils/slugify";

export default function Header() {
    const { data: session } = useSession();
    
    const navItems = [
        {
            name: "Home",
            link: "/",
            icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
        {
            name: "Questions",
            link: "/questions",
            icon: <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />,
        },
    ];

    if (session && session.user && 'id' in session.user)
    navItems.push({
        name: "Profile",
        link: `/users/${(session.user as { id: string }).id}/${slugify((session.user as { name: string }).name)}`,
        icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    });

    return (
        <div className="relative w-full">
            <FloatingNav navItems={navItems} />
        </div>
    );
}