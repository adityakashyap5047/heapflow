import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Provider from "@/components/provider/Provider";
import Footer from "@/components/Footer";

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
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
