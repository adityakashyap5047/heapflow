import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    
    try {
        const {firstName, lastName, email, password} = await request.json();
        
        if(!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 400}
            )
        }

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if(existingUser){
            return NextResponse.json(
                {message: "Email is already registered"},
                {status: 400}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
            }
        });

        return NextResponse.json(
            {message: "User registered successfully", user: {
                id: user.id,
                name: user.name,
                email: user.email
            }},
            {status: 201}
        );
    } catch {
        return NextResponse.json(
            {message: "Failed to register User"},
            {status: 500}
        );
    }
}