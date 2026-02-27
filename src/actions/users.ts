"use server";

import { db } from "@/lib/prisma";
import { authOptions } from "@/store/Auth";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

type UpdateUserType = {
    name: string;
    bio?: string;
    avatarUrl?: string;
};

type ValidationError = {
    field: string;
    message: string;
};

function validateUserData(data: UpdateUserType): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
        errors.push({ field: "name", message: "Name is required" });
    } else if (data.name.trim().length < 2) {
        errors.push({ field: "name", message: "Name must be at least 2 characters" });
    } else if (data.name.trim().length > 50) {
        errors.push({ field: "name", message: "Name must be less than 50 characters" });
    }

    // Bio validation (optional but has max length)
    if (data.bio && data.bio.length > 500) {
        errors.push({ field: "bio", message: "Bio must be less than 500 characters" });
    }

    // Avatar URL validation (optional but must be valid URL if provided)
    if (data.avatarUrl && data.avatarUrl.trim().length > 0) {
        try {
            new URL(data.avatarUrl);
        } catch {
            errors.push({ field: "avatarUrl", message: "Invalid avatar URL" });
        }
    }

    return errors;
}

export async function updateUser(data: UpdateUserType) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const user = session?.user as { id: string } | undefined;
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        const existingUser = await db?.user.findUnique({
            where: { id: user.id },
        });

        if (!existingUser) {
            return { success: false, message: "User not found" };
        }

        // Validate input data
        const validationErrors = validateUserData(data);
        if (validationErrors.length > 0) {
            return {
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            };
        }

        const updatedUser = await db?.user.update({
            where: { id: user.id },
            data: {
                name: data.name.trim(),
                bio: data.bio?.trim() || null,
                avatarUrl: data.avatarUrl?.trim() || null,
            },
        });

        return { success: true, data: updatedUser };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? `Failed to update profile: ${error.message}` : "Failed to update profile",
        };
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await db?.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                avatarUrl: true,
                reputation: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        return { success: true, data: user };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? `Failed to get user: ${error.message}` : "Failed to get user",
        };
    }
}

type ChangePasswordType = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

function validatePasswordData(data: ChangePasswordType): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.currentPassword) {
        errors.push({ field: "currentPassword", message: "Current password is required" });
    }

    if (!data.newPassword) {
        errors.push({ field: "newPassword", message: "New password is required" });
    } else if (data.newPassword.length < 6) {
        errors.push({ field: "newPassword", message: "New password must be at least 6 characters" });
    } else if (data.newPassword.length > 100) {
        errors.push({ field: "newPassword", message: "New password must be less than 100 characters" });
    }

    if (!data.confirmPassword) {
        errors.push({ field: "confirmPassword", message: "Please confirm your new password" });
    } else if (data.newPassword !== data.confirmPassword) {
        errors.push({ field: "confirmPassword", message: "Passwords do not match" });
    }

    if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
        errors.push({ field: "newPassword", message: "New password must be different from current password" });
    }

    return errors;
}

export async function changePassword(data: ChangePasswordType) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return { success: false, message: "Unauthorized" };
        }

        const user = session?.user as { id: string } | undefined;
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        const existingUser = await db?.user.findUnique({
            where: { id: user.id },
        });

        if (!existingUser) {
            return { success: false, message: "User not found" };
        }

        // Validate input data
        const validationErrors = validatePasswordData(data);
        if (validationErrors.length > 0) {
            return {
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            };
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(data.currentPassword, existingUser.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Validation failed",
                errors: [{ field: "currentPassword", message: "Current password is incorrect" }],
            };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        await db?.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? `Failed to change password: ${error.message}` : "Failed to change password",
        };
    }
}

export async function getTopContributors(limit: number = 8) {
    try {
        const contributors = await db?.user.findMany({
            orderBy: { reputation: "desc" },
            take: limit,
        });

        if(!contributors || contributors.length === 0){
            return { success: false, message: "No contributors found" };
        }

        return { success: true, data: contributors };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? `Failed to get top contributors: ${error.message}` : "Failed to get top contributors",
        }; 
    }
}