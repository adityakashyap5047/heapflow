import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Imagekit from "imagekit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/store/Auth";

const imagekit = new Imagekit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized User"},
                {status: 401}
            )
        }
        const user = session?.user as { id: string } | undefined;

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const existingUser = await db?.user.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const fileName = formData.get("fileName") as string | null;
        const folder = formData.get("folder") as string | null;

        if(!file || !fileName){
            return NextResponse.json({error: "No File or FileName provided"}, {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const sanitizedFileName = fileName?.replace(/[^a-zA-Z0-9.-]/g, "_") || "upload";

        const uniqueFileName = `${existingUser.id}/${timestamp}_${sanitizedFileName}`;

        // Default to questions folder, but allow users folder for avatars
        const uploadFolder = folder === "users" ? "/heapflow/users" : "/heapflow/questions";

        const response = await imagekit.upload({
            file: buffer,
            fileName: uniqueFileName,
            folder: uploadFolder
        });

        const thumbnailUrl = imagekit.url({
            src: response.url,
            transformation: [
                {
                    width: 400,
                    height: 300,
                    cropMode: "maintain_ar",
                    quality: 80,
                }
            ]
        })

        return NextResponse.json({
            success: true,
            url: response.url,
            thumbnailUrl: thumbnailUrl,
            fileId: response.fileId,
            width: response.width,
            height: response.height,
            size: response.size,
            name: response.name,
        }, { status: 201 })

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while uploading image."
            },
            {
                status: 500
            }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized User" },
                { status: 401 }
            );
        }

        const user = session?.user as { id: string } | undefined;
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const existingUser = await db?.user.findUnique({
            where: {
                id: user.id,
            },
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { url } = body as { url?: string };

        if (!url) {
            return NextResponse.json(
                { error: "Image URL is required" },
                { status: 400 }
            );
        }

        const urlPath = new URL(url).pathname;

        if (!urlPath.includes(existingUser.id)) {
            return NextResponse.json(
                { error: "You can only delete images you uploaded" },
                { status: 403 }
            );
        }

        const fileName = urlPath.split('/').pop();

        if (!fileName) {
            return NextResponse.json(
                { error: "Invalid image URL" },
                { status: 400 }
            );
        }

        const files = await imagekit.listFiles({
            searchQuery: `name="${fileName}"`,
            limit: 1,
            type: "file",
        });

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "Image not found in storage" },
                { status: 404 }
            );
        }

        const file = files[0] as { filePath: string; fileId: string };
        if (!file.filePath.includes(existingUser.id)) {
            return NextResponse.json(
                { error: "You can only delete images you uploaded" },
                { status: 403 }
            );
        }

        await imagekit.deleteFile(file.fileId);

        return NextResponse.json(
            { success: true, message: "Image deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            {
                error: (error as Error).message || "Unknown error occurred while deleting image."
            },
            { status: 500 }
        );
    }
}