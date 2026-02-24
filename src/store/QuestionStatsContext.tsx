"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface QuestionStatsContextType {
    answerCount: number;
    voteCount: number;
    setAnswerCount: (count: number) => void;
    setVoteCount: (count: number) => void;
    incrementAnswerCount: () => void;
    decrementAnswerCount: () => void;
    updateVoteCount: (delta: number) => void;
}

const QuestionStatsContext = createContext<QuestionStatsContextType | undefined>(undefined);

export function QuestionStatsProvider({ 
    children,
    initialAnswerCount = 0,
    initialVoteCount = 0,
}: { 
    children: ReactNode;
    initialAnswerCount?: number;
    initialVoteCount?: number;
}) {
    const [answerCount, setAnswerCount] = useState(initialAnswerCount);
    const [voteCount, setVoteCount] = useState(initialVoteCount);

    const incrementAnswerCount = useCallback(() => {
        setAnswerCount(prev => prev + 1);
    }, []);

    const decrementAnswerCount = useCallback(() => {
        setAnswerCount(prev => Math.max(0, prev - 1));
    }, []);

    const updateVoteCount = useCallback((delta: number) => {
        setVoteCount(prev => prev + delta);
    }, []);

    return (
        <QuestionStatsContext.Provider value={{ 
            answerCount, 
            voteCount, 
            setAnswerCount, 
            setVoteCount,
            incrementAnswerCount,
            decrementAnswerCount,
            updateVoteCount,
        }}>
            {children}
        </QuestionStatsContext.Provider>
    );
}

export function useQuestionStats() {
    const context = useContext(QuestionStatsContext);
    if (context === undefined) {
        throw new Error("useQuestionStats must be used within a QuestionStatsProvider");
    }
    return context;
}

// A safe hook that returns null if not within provider (for components used outside question page)
export function useQuestionStatsOptional() {
    return useContext(QuestionStatsContext);
}
