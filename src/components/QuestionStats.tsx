"use client";

import { useQuestionStats } from "@/store/QuestionStatsContext";
import convertDateToRelativeTime from "@/utils/relativeTime";

interface QuestionStatsProps {
    createdAt: Date;
}

export default function QuestionStats({ createdAt }: QuestionStatsProps) {
    const { answerCount, voteCount } = useQuestionStats();

    return (
        <div className="flex gap-4 text-sm">
            <span>
                Asked {convertDateToRelativeTime(createdAt)}
            </span>
            <span>Answer {answerCount}</span>
            <span>Votes {voteCount}</span>
        </div>
    );
}
