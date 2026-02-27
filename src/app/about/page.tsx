import Link from "next/link";

export const metadata = {
    title: "About | HeapFlow",
    description: "Learn about HeapFlow - A Q&A platform for developers to ask questions, share knowledge, and grow together.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center">About HeapFlow</h1>
                <p className="text-xl text-muted-foreground text-center mb-12">
                    Empowering developers to learn, share, and grow together
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            HeapFlow is a Q&A platform built by developers, for developers. Our mission is to create
                            a welcoming space where programmers of all skill levels can ask questions, share their
                            expertise, and help each other overcome coding challenges. We believe that knowledge
                            grows when it&apos;s shared, and every question deserves a thoughtful answer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                                <h3 className="text-xl font-semibold mb-3">🤔 Ask Questions</h3>
                                <p className="text-muted-foreground">
                                    Stuck on a problem? Post your question and get help from experienced developers
                                    in the community. No question is too basic or too complex.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                                <h3 className="text-xl font-semibold mb-3">💡 Share Knowledge</h3>
                                <p className="text-muted-foreground">
                                    Help others by answering questions. Share your expertise and contribute to the
                                    collective knowledge of the developer community.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                                <h3 className="text-xl font-semibold mb-3">⬆️ Vote & Curate</h3>
                                <p className="text-muted-foreground">
                                    Upvote helpful answers and questions to highlight the best content. Our voting
                                    system ensures quality solutions rise to the top.
                                </p>
                            </div>
                            <div className="p-6 rounded-lg border border-white/10 bg-white/5">
                                <h3 className="text-xl font-semibold mb-3">🏆 Build Reputation</h3>
                                <p className="text-muted-foreground">
                                    Earn reputation points for your contributions. Your reputation reflects your
                                    expertise and involvement in the community.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">🤝</span>
                                <div>
                                    <h3 className="font-semibold">Inclusivity</h3>
                                    <p className="text-muted-foreground">
                                        Everyone is welcome here, regardless of experience level, background, or
                                        programming language preference.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">📚</span>
                                <div>
                                    <h3 className="font-semibold">Knowledge Sharing</h3>
                                    <p className="text-muted-foreground">
                                        We believe in the power of open knowledge exchange. Every contribution
                                        helps someone learn something new.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">✨</span>
                                <div>
                                    <h3 className="font-semibold">Quality</h3>
                                    <p className="text-muted-foreground">
                                        We strive for high-quality, well-explained answers that truly help solve
                                        problems and teach concepts.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-2xl">🌱</span>
                                <div>
                                    <h3 className="font-semibold">Growth</h3>
                                    <p className="text-muted-foreground">
                                        We&apos;re all learning together. Whether you&apos;re asking or answering, every
                                        interaction is an opportunity to grow.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Ready to be part of a thriving developer community? Whether you have a question that
                            needs answering or knowledge you&apos;d like to share, HeapFlow is the place for you.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                href="/questions"
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                Browse Questions
                            </Link>
                            <Link
                                href="/questions/ask"
                                className="px-6 py-3 border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                            >
                                Ask a Question
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
