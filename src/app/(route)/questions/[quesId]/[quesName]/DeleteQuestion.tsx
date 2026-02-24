"use client";

import { deleteQuestion } from "@/actions/questions";
import { IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteQuestion = ({ questionId, authorId, imageUrl }: { questionId: string; authorId: string; imageUrl?: string }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as { id: string } | undefined;
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            if (imageUrl) {
                try {
                    const response = await fetch("/api/imagekit", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url: imageUrl }),
                    });
                    if (!response.ok) {
                        console.error("Failed to delete image from ImageKit");
                    }
                } catch (error) {
                    console.error("Error deleting image:", error);
                }
            }

            const response = await deleteQuestion(questionId);
            
            if (response.success) {
                toast.success("Question deleted successfully");
                setOpen(false);
                router.push("/questions");
            } else {
                toast.error(response.message || "Error deleting question");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "Error deleting question");
            } else {
                toast.error(String(error) || "Error deleting question");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    if (user?.id !== authorId) return null;

    return (
        <AlertDialog open={open} onOpenChange={(value) => !isDeleting && setOpen(value)}>
            <AlertDialogTrigger asChild>
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500 p-1 text-red-500 duration-200 hover:bg-red-500/10"
                >
                    <IconTrash className="h-4 w-4" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Question</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this question? This action cannot be undone.
                        All answers and comments will also be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        variant="destructive"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteQuestion;