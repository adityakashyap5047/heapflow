import { db } from "@/lib/prisma";
import EditQues from "./EditQues";

interface PageProps {
  params: Promise<{ quesId: string; quesName: string }>;
}

const getQuestion = async (quesId: string) => {
  return await db.question.findUnique({ where: { id: quesId } });
};

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;

  if (!resolvedParams?.quesId) {
    throw new Error("Question ID is required");
  }

  const question = await getQuestion(resolvedParams?.quesId);

  if (!question) {
    return <p className="text-red-500">Question not found</p>
  }

  return <EditQues question={question} />;
};

export default Page;