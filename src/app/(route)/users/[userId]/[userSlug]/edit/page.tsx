"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateUser, getUserById, changePassword } from "@/actions/users";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios";
import slugify from "@/utils/slugify";
import { Meteors } from "@/components/magicui/meteors";
import { cn } from "@/lib/utils";
import { IconLoader2, IconUpload, IconX, IconEye, IconEyeOff } from "@tabler/icons-react";

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
            <Meteors number={30} />
            {children}
        </div>
    );
};

type FormErrors = {
    name?: string;
    bio?: string;
    avatarUrl?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
};

const Page = () => {
    const { userId, userSlug } = useParams();
    const { data: session, status } = useSession();
    const router = useRouter();

    const user = session?.user as { id: string } | undefined;

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        avatarUrl: "",
    });
    const [originalAvatarUrl, setOriginalAvatarUrl] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [errors, setErrors] = useState<FormErrors>({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        
        if (!user || user.id !== userId) {
            router.push(`/users/${userId}/${userSlug}`);
            return;
        }

        const fetchUser = async () => {
            const response = await getUserById(userId as string);
            if (response.success && response.data) {
                setFormData({
                    name: response.data.name || "",
                    bio: response.data.bio || "",
                    avatarUrl: response.data.avatarUrl || "",
                });
                setOriginalAvatarUrl(response.data.avatarUrl || "");
            }
            setPageLoading(false);
        };

        fetchUser();
    }, [userId, userSlug, user, status, router]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (formData.name.trim().length > 50) {
            newErrors.name = "Name must be less than 50 characters";
        }

        if (formData.bio && formData.bio.length > 500) {
            newErrors.bio = "Bio must be less than 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadAvatar = async (file: File) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("fileName", file.name);
        formDataUpload.append("folder", "users");

        const res = await axios.post("/api/imagekit", formDataUpload);

        if (!res.data.success) {
            throw new Error(res.data.error || "Avatar upload failed");
        }
        return res.data.url as string;
    };

    const deleteAvatar = async (url: string) => {
        try {
            await axios.delete("/api/imagekit", {
                data: { url },
            });
        } catch (error) {
            console.error("Failed to delete old avatar:", error);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Avatar must be less than 5MB");
                return;
            }
            if (!file.type.startsWith("image/")) {
                toast.error("Please upload an image file");
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const removeAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        setFormData((prev) => ({ ...prev, avatarUrl: "" }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            let newAvatarUrl = formData.avatarUrl;

            // If new avatar file is selected, upload it
            if (avatarFile) {
                // Delete old avatar if exists
                if (originalAvatarUrl) {
                    await deleteAvatar(originalAvatarUrl);
                }
                newAvatarUrl = await uploadAvatar(avatarFile);
            } else if (!formData.avatarUrl && originalAvatarUrl) {
                // User removed avatar without adding new one
                await deleteAvatar(originalAvatarUrl);
                newAvatarUrl = "";
            }

            const response = await updateUser({
                name: formData.name,
                bio: formData.bio || undefined,
                avatarUrl: newAvatarUrl || undefined,
            });

            if (response.success) {
                toast.success("Profile updated successfully");
                router.push(`/users/${userId}/${slugify(formData.name)}`);
                router.refresh();
            } else {
                if (response.errors) {
                    const newErrors: FormErrors = {};
                    response.errors.forEach((err: { field: string; message: string }) => {
                        newErrors[err.field as keyof FormErrors] = err.message;
                    });
                    setErrors(newErrors);
                }
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const validatePasswordForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = "New password must be at least 6 characters";
        } else if (passwordData.newPassword.length > 100) {
            newErrors.newPassword = "New password must be less than 100 characters";
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (passwordData.currentPassword && passwordData.newPassword && 
            passwordData.currentPassword === passwordData.newPassword) {
            newErrors.newPassword = "New password must be different from current password";
        }

        setErrors((prev) => ({ ...prev, ...newErrors }));
        return !newErrors.currentPassword && !newErrors.newPassword && !newErrors.confirmPassword;
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            });

            if (response.success) {
                toast.success("Password changed successfully");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setErrors((prev) => ({
                    ...prev,
                    currentPassword: undefined,
                    newPassword: undefined,
                    confirmPassword: undefined,
                }));
            } else {
                if (response.errors) {
                    const newErrors: FormErrors = {};
                    response.errors.forEach((err: { field: string; message: string }) => {
                        newErrors[err.field as keyof FormErrors] = err.message;
                    });
                    setErrors((prev) => ({ ...prev, ...newErrors }));
                }
                toast.error(response.message || "Failed to change password");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (pageLoading || status === "loading") {
        return (
            <div className="flex items-center justify-center py-20">
                <IconLoader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!user || user.id !== userId) {
        return null;
    }

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <LabelInputContainer>
                    <Label htmlFor="avatar">
                        Profile Picture
                        <br />
                        <small className="text-gray-400">Upload a profile picture (max 5MB)</small>
                    </Label>
                    <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 shrink-0">
                            {avatarPreview || formData.avatarUrl ? (
                                <>
                                    <Image
                                        src={avatarPreview || formData.avatarUrl}
                                        alt="Avatar preview"
                                        fill
                                        className="rounded-xl object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeAvatar}
                                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    >
                                        <IconX className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/10 text-2xl font-bold text-gray-400">
                                    {formData.name ? slugify(formData.name).slice(0, 2).toUpperCase() : "?"}
                                </div>
                            )}
                        </div>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm transition-colors hover:bg-white/10">
                            <IconUpload className="h-4 w-4" />
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {errors.avatarUrl && (
                        <p className="text-sm text-red-500">{errors.avatarUrl}</p>
                    )}
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                        <br />
                        <small className="text-gray-400">Your display name (2-50 characters)</small>
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, name: e.target.value }));
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="bio">
                        Bio
                        <br />
                        <small className="text-gray-400">
                            Tell us about yourself (max 500 characters)
                            {formData.bio && ` - ${500 - formData.bio.length} remaining`}
                        </small>
                    </Label>
                    <textarea
                        id="bio"
                        name="bio"
                        placeholder="Write a short bio about yourself..."
                        value={formData.bio}
                        onChange={(e) => {
                            setFormData((prev) => ({ ...prev, bio: e.target.value }));
                            if (errors.bio) setErrors((prev) => ({ ...prev, bio: undefined }));
                        }}
                        rows={4}
                        className="w-full rounded-md border border-gray-500 bg-[#020617] px-3 py-2 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none resize-none"
                        aria-invalid={!!errors.bio}
                    />
                    {errors.bio && (
                        <p className="text-sm text-red-500">{errors.bio}</p>
                    )}
                </LabelInputContainer>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    >
                        {loading ? (
                            <>
                                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/users/${userId}/${userSlug}`)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>

            {/* Password Change Section */}
            <div className="mt-10 border-t border-white/10 pt-10">
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                    <LabelInputContainer>
                        <Label htmlFor="currentPassword">
                            Current Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter your current password"
                                value={passwordData.currentPassword}
                                onChange={(e) => {
                                    setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }));
                                    if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                                }}
                                className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                                aria-invalid={!!errors.currentPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showCurrentPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-sm text-red-500">{errors.currentPassword}</p>
                        )}
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="newPassword">
                            New Password <span className="text-red-500">*</span>
                            <br />
                            <small className="text-gray-400">Must be at least 6 characters</small>
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                value={passwordData.newPassword}
                                onChange={(e) => {
                                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }));
                                    if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: undefined }));
                                }}
                                className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                                aria-invalid={!!errors.newPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showNewPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">{errors.newPassword}</p>
                        )}
                    </LabelInputContainer>

                    <LabelInputContainer>
                        <Label htmlFor="confirmPassword">
                            Confirm New Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => {
                                    setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }));
                                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                                }}
                                className="text-white bg-[#020617] border border-gray-500 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                                aria-invalid={!!errors.confirmPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                {showConfirmPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                        )}
                    </LabelInputContainer>

                    <Button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    >
                        {passwordLoading ? (
                            <>
                                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                Changing Password...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Page;