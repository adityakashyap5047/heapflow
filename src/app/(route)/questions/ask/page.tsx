"use client"

import QuestionForm from '@/components/question/QuestionForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

function Page() {

    const router = useRouter();
    const { data: session, status } = useSession();
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (!session || !session.user) return null;

    return (
        <div>
            <QuestionForm />
        </div>
    )
}

export default Page