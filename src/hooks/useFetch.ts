"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
};

const useFetch = <T, Args extends unknown[] = unknown[]>(
    cb: (...args: Args) => Promise<ApiResponse<T>>,
    options: {
        autoFetch?: boolean;
        args?: Args;
    } = {},
) => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { autoFetch = true, args = [] as unknown as Args } = options;

    const fn = useCallback(
        async (...params: Args) => {
            setLoading(true);
            setError(null);
            try {
                const response = await cb(...params);
                if (response?.success) {
                    setData(response.data);
                    return response.data;
                } else {
                    setError(response?.error || "An error occurred");
                    toast.error(response?.error || "An error occurred");
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : "An error occurred";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        },
        [cb],
    );

    useEffect(() => {
        if (autoFetch) {
            fn(...args);
        }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [autoFetch, ...args]);

    return { data, loading, error, fn, setData };
};

export default useFetch;