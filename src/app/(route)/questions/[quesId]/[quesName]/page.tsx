import Link from "next/link";
import { TracingBeam } from "@/components/magicui/tracing-beam";
import { Particles } from "@/components/magicui/particles";
import { MarkdownPreview } from "@/components/RTE";
import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import VoteButtons from "@/components/VoteButtons";
import EditQuestion from "./EditQuestion";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import DeleteQuestion from "./DeleteQuestion";
import { getQuestionById } from "@/actions/questions";
import { getVote } from "@/actions/votes";
import Image from "next/image";
import { getComments } from "@/actions/comments";
import UserReputationDisplay from "@/components/UserReputationDisplay";
import { QuestionStatsProvider } from "@/store/QuestionStatsContext";
import QuestionStats from "@/components/QuestionStats";

interface PageProps {
    params: Promise<{ quesId: string; quesName: string }>;
}

const Page = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const questionData = await getQuestionById(resolvedParams.quesId);
    const upvotedData = await getVote({ questionId: resolvedParams.quesId, type: "QUESTION", status: "upvoted" });
    const downvotedData = await getVote({ questionId: resolvedParams.quesId, type: "QUESTION", status: "downvoted" });

    const commentsData = await getComments({ questionId: resolvedParams.quesId, type: "QUESTION" });
    const comments = commentsData.success ? commentsData.data : null;

    const question = questionData.success ? questionData.data : null;
    const answers = question ? question.answers : null;
    const author = question ? question.author : null;
    const upvotes = upvotedData.success ? upvotedData.data : null;
    const downvotes = downvotedData.success ? downvotedData.data : null;

    const initialAnswerCount = answers?.length || 0;
    const initialVoteCount = (upvotes?.length || 0) + (downvotes?.length || 0);

    return (
        <QuestionStatsProvider initialAnswerCount={initialAnswerCount} initialVoteCount={initialVoteCount}>
            <TracingBeam className="container pl-6">
                <Particles
                    className="fixed inset-0 h-full w-full"
                    quantity={500}
                    ease={100}
                    color="#ffffff"
                    refresh
                />
                <div className="relative mx-auto px-4 pb-20 pt-36">
                    <div className="flex">
                        <div className="w-full">
                            <h1 className="mb-1 text-3xl font-bold">{question?.title}</h1>
                            <QuestionStats createdAt={new Date(question?.createdAt || new Date())} />
                        </div>
                        <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
                            <ShimmerButton className="shadow-2xl">
                                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                    Ask a question
                                </span>
                            </ShimmerButton>
                        </Link>
                    </div>
                    <hr className="my-4 border-white/40" />
                    <div className="flex gap-4">
                        <div className="flex shrink-0 flex-col items-center gap-4">
                            <VoteButtons
                                type="question"
                                id={question?.id ? question.id : ""}
                                className="w-full"
                                upvotes={upvotes || []}
                                downvotes={downvotes || []}
                            />
                            <EditQuestion
                                questionId={question?.id ?? ""}
                                questionTitle={question?.title ?? ""}
                                authorId={question?.authorId ?? ""}
                        />
                        <DeleteQuestion 
                            questionId={question?.id ?? ""} 
                            authorId={question?.authorId ?? ""} 
                            imageUrl={question?.imageUrl}
                        />
                    </div>
                    <div className="w-full overflow-auto">
                        <MarkdownPreview className="rounded-xl p-4" source={question?.content ?? ""} />
                        <picture>
                            <Image
                                src={question?.imageUrl ?? ""}
                                alt={question?.title ?? "Question Image"}
                                className="mt-3 rounded-lg w-full h-auto object-cover"
                                width={500}
                                height={500}
                            />
                        </picture>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            {question?.tags.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/questions?tag=${tag}`}
                                    className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                        <UserReputationDisplay 
                            author={author ? {
                                id: author.id,
                                name: author.name,
                                avatarUrl: author.avatarUrl,
                                reputation: author.reputation
                            } : null}
                        />
                        <Comments
                            comments={comments || []}
                            className="mt-4"
                            type="question"
                            typeId={question?.id ?? ""}
                        />
                        <hr className="my-4 border-white/40" />
                    </div>
                </div>
                <Answers answers={answers || []} questionId={question?.id ?? ""} />
            </div>
        </TracingBeam>
        </QuestionStatsProvider>
    );
};

export default Page;