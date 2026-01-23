"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
            >
            {children}
            <Toaster richColors />
            </ThemeProvider>
        </SessionProvider>
    )
}