import React from "react";
import QuestionCard from "../question/QuestionCard";
import { db } from "@/lib/prisma";

const LatestQuestions = async () => {
    const questions = await db.question.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        include: {
            author: true,
        }
    });
    return (
        <div className="space-y-6">
            {questions.map(question => (
                <QuestionCard key={question.id} ques={question} />
            ))}
        </div>
    );
};

export default LatestQuestions;