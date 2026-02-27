

export const metadata = {
    title: "Privacy Policy | HeapFlow",
    description: "Privacy Policy for HeapFlow - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
                <p className="text-muted-foreground text-center mb-12">
                    Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to HeapFlow. We respect your privacy and are committed to protecting your personal data.
                            This privacy policy explains how we collect, use, disclose, and safeguard your information when
                            you visit our platform. Please read this privacy policy carefully.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Account information (name, email address, password)</li>
                            <li>Profile information (username, profile picture, bio)</li>
                            <li>Content you post (questions, answers, comments, votes)</li>
                            <li>Communications with us (support requests, feedback)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Create and manage your account</li>
                            <li>Process and display your questions, answers, and comments</li>
                            <li>Calculate and display reputation scores</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Monitor and analyze trends, usage, and activities</li>
                            <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may share information about you as follows:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Your public profile, questions, answers, and comments are visible to all users</li>
                            <li>With vendors and service providers who need access to perform services for us</li>
                            <li>In response to legal process or government requests</li>
                            <li>To protect our rights, privacy, safety, or property</li>
                            <li>In connection with any merger or acquisition</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We take reasonable measures to help protect your personal information from loss, theft,
                            misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet
                            transmission is ever fully secure or error-free. We encourage you to use strong passwords
                            and keep your login credentials confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar tracking technologies to collect information about your browsing
                            activities. Cookies help us remember your preferences, understand how you use our platform,
                            and improve your experience. You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal data:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Access and receive a copy of your personal data</li>
                            <li>Rectify inaccurate personal data</li>
                            <li>Request deletion of your personal data</li>
                            <li>Object to processing of your personal data</li>
                            <li>Request restriction of processing</li>
                            <li>Data portability</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            HeapFlow is not intended for children under 13 years of age. We do not knowingly collect
                            personal information from children under 13. If we learn we have collected personal
                            information from a child under 13, we will delete that information promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this privacy policy from time to time. We will notify you of any changes by
                            posting the new privacy policy on this page and updating the &quot;Last updated&quot; date.
                            Your continued use of HeapFlow after any changes indicates your acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about this privacy policy or our privacy practices, please contact
                            us through our platform or reach out to our support team.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
