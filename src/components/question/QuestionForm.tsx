"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import confetti from "canvas-confetti";
import slugify from "@/utils/slugify";
import RTE from "../RTE";
import { Meteors } from "../magicui/meteors";
import type { Question as PrismaQuestion } from "@prisma/client";
import { useSession } from "next-auth/react";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import { createQuestion, updateQuestion } from "@/actions/questions";
import { toast } from "sonner";

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
                className
            )}
        >
            <Meteors number={50} />
            {children}
        </div>
    );
};

const QuestionForm = ({ question }: { question?: PrismaQuestion }) => {
    const [tag, setTag] = React.useState("");
    const router = useRouter();
    const { data: session } = useSession();

    const user = session?.user as { id: string } | undefined;

    const [formData, setFormData] = React.useState({
        title: String(question?.title || ""),
        content: String(question?.content || ""),
        authorId: user?.id,
        tags: new Set((question?.tags || []) as string[]),
        attachment: null as File | null,
    });
    React.useEffect(() => {
        if (user?.id) {
            setFormData((prev) => ({ ...prev, authorId: user.id }));
        }
    }, [user]);

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const { fn: createQuestionFn } = useFetch(createQuestion, {
        autoFetch: false,
    });

    const loadConfetti = (timeInMS = 3000) => {
        const end = Date.now() + timeInMS;
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    const upload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);

        const res = await axios.post("/api/imagekit", formData);

        if (!res.data.success) {
            throw new Error(res.data.error || "Image upload failed");
        }
        return res.data as {
            success: boolean;
            url: string;
            thumbnailUrl: string;
            fileId: string;
            width: number;
            height: number;
            size: number;
            name: string;
        };
    };

    const deleteImage = async (url: string) => {
        const res = await axios.delete("/api/imagekit", {
            data: { url },
        });

        if (!res.data.success) {
            throw new Error(res.data.error || "Image deletion failed");
        }
        return res.data;
    };


    const create = async () => {

        let imageData: {
            url?: string;
            thumbnailUrl?: string;
            fileId?: string;
        } = {};

        if (!formData.attachment) throw new Error("Please upload an image");

        if (formData.attachment) {
            imageData = await upload(formData.attachment);
        }
        const url = imageData.url ?? "";
        const questionData = await createQuestionFn({
            title: formData.title,
            content: formData.content,
            imageUrl: url,
            tags: Array.from(formData.tags),
        });

        loadConfetti();
        toast.success("Question created successfully!");
        return questionData;
    };
    
    const update = async () => {
        if (!question) throw new Error("Please provide a question");

        let imageUrl: string | undefined = undefined;

        if (formData.attachment) {
            if (question.imageUrl) {
                try {
                    await deleteImage(question.imageUrl);
                } catch (error) {
                    console.error("Failed to delete old image:", error);
                    // Continue with upload even if deletion fails
                }
            }

            const imageData = await upload(formData.attachment);
            imageUrl = imageData.url;
        }

        const response = await updateQuestion({
            questionId: question.id,
            title: formData.title,
            content: formData.content,
            tags: Array.from(formData.tags),
            ...(imageUrl !== undefined && { imageUrl }),
        });

        if (!response.success) {
            throw new Error(response.message || "Failed to update question");
        }

        loadConfetti();
        toast.success("Question updated successfully!");
        return response.data;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.authorId) {
            setError(() => "Please fill out all fields");
            return;
        }

        setLoading(() => true);
        setError(() => "");

        try {
            const response = question ? await update() : await create();
            if (!response) {
                setError(() => "Something went wrong");
                return;
            }
            router.push(`/questions/${response.id}/${slugify(formData.title)}`);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(String(error));
            }
        }

        setLoading(() => false);
    };

    return (
        <form className="space-y-4 p-2" onSubmit={submit}>
            <LabelInputContainer>
                <Label>
                    <p className="text-xl pt-24">Need Help? Ask a Question</p>
                    <small className="text-gray-400">
                        <p className="pl-4 mt-4">- Write a **clear and specific** title.</p>
                        <p className="pl-4 mt-1">- Describe your problem in detail (**min. 20 characters**).</p>
                        <p className="pl-4 mt-1">- Upload an **image** if it helps explain your issue.</p>
                        <p className="pl-4 mt-1">- Add **relevant tags** (e.g., JavaScript, Next.js, TypeScript).</p>
                        <p className="pl-4 mt-1">- Be respectful and **follow community guidelines**.</p>
                    </small>
                </Label>
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="title">
                    Title Address
                    <br />
                    <small>
                        Be specific and imagine you&apos;re asking a question to another person.
                    </small>
                </Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="text"
                    className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="content">
                    What are the details of your problem?
                    <br />
                    <small>
                        Introduce the problem and expand on what you put in the title. Minimum 20
                        characters.
                    </small>
                </Label>
                <RTE
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="image">
                    Image
                    <br />
                    <small>
                        Add image to your question to make it more clear and easier to understand.
                    </small>
                </Label>
                <Input
                    id="image"
                    name="image"
                    accept="image/*"
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    type="file"
                    onChange={e => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setFormData(prev => ({
                            ...prev,
                            attachment: files[0],
                        }));
                    }}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="tag">
                    Tags
                    <br />
                    <small>
                        Add tags to describe what your question is about. Start typing to see
                        suggestions.
                    </small>
                </Label>
                <div className="flex w-full gap-4">
                    <div className="w-full">
                        <Input
                            id="tag"
                            name="tag"
                            placeholder="e.g. (java c objective-c)"
                            type="text"
                            className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={tag}
                            onChange={e => setTag(() => e.target.value)}
                        />
                    </div>
                    <button
                        className="relative shrink-0 rounded-full border border-slate-600 bg-slate-700 px-8 py-2 text-sm text-white transition duration-200 hover:shadow-2xl hover:shadow-white/10"
                        type="button"
                        onClick={() => {
                            if (tag.length === 0) return;
                            setFormData(prev => ({
                                ...prev,
                                tags: new Set([...Array.from(prev.tags), tag]),
                            }));
                            setTag(() => "");
                        }}
                    >
                        <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-linear-to-r from-transparent via-teal-500 to-transparent shadow-2xl" />
                        <span className="relative z-20">Add</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {Array.from(formData.tags).map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="group relative inline-block rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900">
                                <span className="absolute inset-0 overflow-hidden rounded-full">
                                    <span className="absolute inset-0 rounded-full [radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </span>
                                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
                                    <span>{tag}</span>
                                    <button
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                tags: new Set(
                                                    Array.from(prev.tags).filter(t => t !== tag)
                                                ),
                                            }));
                                        }}
                                        type="button"
                                    >
                                        <IconX size={12} />
                                    </button>
                                </div>
                                <span className="absolute bottom-0 left-4.5 h-px w-[calc(100%-2.25rem)] bg-linear-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </LabelInputContainer>
            {error && (
                <LabelInputContainer>
                    <div className="text-center">
                        <span className="text-red-500">{error}</span>
                    </div>
                </LabelInputContainer>
            )}
            <div className="flex justify-center items-center">
                <button
                    className="w-1/2 flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-size-[200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    type="submit"
                    disabled={loading}
                >
                    {question ? "Update" : "Publish"}
                </button>
            </div>
        </form>
    );
};

export default QuestionForm;