import React from "react";
import QuestionCard from "../question/QuestionCard";
import { getQuestions } from "@/actions/questions";

const LatestQuestions = async () => {
    const result = await getQuestions({ page: 1, limit: 4,});
    const questions = result.success && result.data ? result.data.questions : [];
    return (
        <div className="space-y-6">
            {questions.map(question => (
                <QuestionCard key={question.id} ques={question} />
            ))}
        </div>
    );
};

export default LatestQuestions;