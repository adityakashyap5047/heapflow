import { db } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials.password) {
                    throw new Error("Missing email or password");
                }

                try {
                    const user = await db.user.findUnique({
                        where: {
                            email: credentials.email,
                        }
                    });

                    if (!user) {
                        throw new Error("No user found");
                    }

                    if (!user.password) {
                        throw new Error("Invalid credentials");
                    }

                    const isMatched = await bcrypt.compare(credentials.password, user.password);

                    if (!isMatched) {
                        throw new Error("Wrong Password!!!, Password didn't match");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        bio: user.bio,
                        avatarUrl: user.avatarUrl,
                        reputation: user.reputation,
                    };
                } catch (error) {
                    throw error;
                }
            }
        })
    ], 

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = (user as { email?: string }).email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { id?: string }).id = token.id as string;
                (session.user as { email?: string }).email = token.email as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}