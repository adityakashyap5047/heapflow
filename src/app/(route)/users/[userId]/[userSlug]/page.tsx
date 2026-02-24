import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { db } from "@/lib/prisma";

interface PageProps {
    params: Promise<{ userId: string; userSlug: string }>; 
}

const Page = async ({ params }: PageProps) => {
    const resolvedParams = await params;
    const [user, questionCount, answerCount] = await Promise.all([
        db.user.findUnique({ where: { id: resolvedParams.userId } }),
        db.question.count({ where: { authorId: resolvedParams.userId } }),
        db.answer.count({ where: { authorId: resolvedParams.userId } }),
    ])

    return (
        <MagicContainer className={"flex h-125 w-full flex-col gap-4 lg:h-62.5 lg:flex-row"}>
            <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="text-xl font-medium">Reputation</h2>
                </div>
                <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                    <NumberTicker value={user?.reputation || 0} />
                </p>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
            <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="text-xl font-medium">Questions asked</h2>
                </div>
                <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                    <NumberTicker value={questionCount} />
                </p>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
            <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl">
                <div className="absolute inset-x-4 top-4">
                    <h2 className="text-xl font-medium">Answers given</h2>
                </div>
                <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
                    <NumberTicker value={answerCount} />
                </p>
                <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </MagicCard>
        </MagicContainer>
    );
};

export default Page;