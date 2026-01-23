import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeapFlow",
  description: "HeapFlow is a Q&A platform where developers can ask programming questions, post answers, and vote on the best solutions.",
  icons: {
    icon: "/HeapFlow.png",
    shortcut: "/HeapFlow.png",
    apple: "/HeapFlow.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
