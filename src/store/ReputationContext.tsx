"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ReputationMap = Record<string, number>;

interface ReputationContextType {
    reputations: ReputationMap;
    getReputation: (userId: string, fallback?: number) => number;
    updateReputation: (userId: string, reputation: number) => void;
    initializeReputations: (users: { id: string; reputation: number }[]) => void;
}

const ReputationContext = createContext<ReputationContextType | undefined>(undefined);

export function ReputationProvider({ children }: { children: ReactNode }) {
    const [reputations, setReputations] = useState<ReputationMap>({});

    const getReputation = useCallback((userId: string, fallback: number = 0) => {
        return reputations[userId] ?? fallback;
    }, [reputations]);

    const updateReputation = useCallback((userId: string, reputation: number) => {
        setReputations(prev => ({
            ...prev,
            [userId]: reputation,
        }));
    }, []);

    const initializeReputations = useCallback((users: { id: string; reputation: number }[]) => {
        setReputations(prev => {
            const newReputations = { ...prev };
            users.forEach(user => {
                if (newReputations[user.id] === undefined) {
                    newReputations[user.id] = user.reputation;
                }
            });
            return newReputations;
        });
    }, []);

    return (
        <ReputationContext.Provider value={{ reputations, getReputation, updateReputation, initializeReputations }}>
            {children}
        </ReputationContext.Provider>
    );
}

export function useReputation() {
    const context = useContext(ReputationContext);
    if (context === undefined) {
        throw new Error("useReputation must be used within a ReputationProvider");
    }
    return context;
}
