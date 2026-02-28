"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";


const Layout = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useSession();
    const router = useRouter()

    React.useEffect(() => {
        if (session && session.user) {
            router.push("/")
        }
    }, [session, router])

    if (session && session.user) {
        return null
    }

    return (
        <div className="relative flex flex-col items-center justify-center py-4">
            <BackgroundBeams />
            <div className="relative">{children}</div>
        </div>
    )
}


export default Layout