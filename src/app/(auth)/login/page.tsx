"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};

export default function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill out all fields");
            toast.error('Please fill out all fields');
            return;
        }

        
        try {
            setIsLoading(() => true);
            setError(() => "");
            const result = await signIn("credentials", {
                redirect: false,
                email: email.toString().trim(),
                password: password.toString().trim(),
            })
            if (result?.error) {
                setError('Invalid email or password');
                toast.error('Invalid email or password');
            } else {
                toast.success('Welcome back! You are now logged in.');
                router.push('/');
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(() => false);
            setEmail("");
            setPassword("");
        }
    };

    return (
        <div className="mx-auto w-full max-w-md border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Login to HeapFlow
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Login to heapflow
                <br /> If you don&apos;t have an account,{" "}
                <Link href="/register" className="text-orange-500 hover:underline">
                    register
                </Link>{" "}
                with heapflow
            </p>

            {error && (
                <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                    className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        id="email"
                        name="email"
                        placeholder="projectmayhem@fc.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" id="password" name="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:cursor-not-allowed cursor-pointer"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing in..." : <>Log in &rarr;</>}
                    <BottomGradient />
                </button>

                <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
            </form>
        </div>
    );
}