"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";
import { ReputationProvider } from "@/store/ReputationContext";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ReputationProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                >
                {children}
                <Toaster richColors />
                </ThemeProvider>
            </ReputationProvider>
        </SessionProvider>
    )
}