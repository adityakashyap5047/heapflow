import Link from "next/link";
import Search from "./Search";
import QuestionCard from "@/components/question/QuestionCard";
import Pagination from "@/components/Pagination";
import { getQuestions } from "@/actions/questions";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

interface PageProps {
    searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || "1", 10);
    const tag = resolvedSearchParams.tag;
    const search = resolvedSearchParams.search;

    const result = await getQuestions({ page, limit: 10, tag, search });
    if (!result.success || !result.data) {
        return (
            <div className="container mx-auto px-4 pb-20 pt-36 md:max-w-3xl">
                <p className="text-red-500">Failed to load questions</p>
            </div>
        );
    }

    const { questions, total } = result.data;

    return (
        <div className="container mx-auto px-4 pb-20 pt-36 md:max-w-3xl">
            <div className="mb-10 flex items-center justify-between">
                <h1 className="text-3xl font-bold">All Questions</h1>
                <Link href="/questions/ask">
                    <ShimmerButton className="shadow-2xl">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            Ask a question
                        </span>
                    </ShimmerButton>
                </Link>
            </div>
            <div className="mb-4">
                <Search />
            </div>
            <div className="mb-4">
                <p>{total} questions</p>
            </div>
            <div className="mb-4 space-y-6">
                {questions.map((ques) => (
                    <QuestionCard key={ques.id} ques={ques} />
                ))}
            </div>
            <Pagination total={total} limit={10} currentPage={page} />
        </div>
    );
};

export default Page;