

export const metadata = {
    title: "Terms of Service | HeapFlow",
    description: "Terms of Service for HeapFlow - Read our terms and conditions for using the platform.",
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
                <p className="text-muted-foreground text-center mb-12">
                    Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using HeapFlow, you agree to be bound by these Terms of Service. If you do
                            not agree to these terms, please do not use our platform. We reserve the right to modify
                            these terms at any time, and your continued use constitutes acceptance of any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            HeapFlow is a Q&A platform designed for developers to ask programming questions, share
                            knowledge, post answers, and interact with the developer community through voting and
                            commenting. We provide tools and features to facilitate knowledge sharing and
                            collaborative problem-solving.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To access certain features, you must create an account. You agree to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your password and account</li>
                            <li>Notify us immediately of any unauthorized use of your account</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Not share your account credentials with others</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You retain ownership of content you post on HeapFlow. By posting content, you grant us a
                            non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute
                            your content on our platform. You agree that your content will not:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on intellectual property rights of others</li>
                            <li>Contain spam, malware, or malicious code</li>
                            <li>Include harassment, hate speech, or threatening content</li>
                            <li>Impersonate other users or entities</li>
                            <li>Share private or confidential information without consent</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You agree to use HeapFlow responsibly and not to:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Use automated tools to scrape or collect data without permission</li>
                            <li>Interfere with or disrupt the platform&apos;s functionality</li>
                            <li>Manipulate voting systems or reputation scores</li>
                            <li>Create multiple accounts for fraudulent purposes</li>
                            <li>Engage in any activity that violates applicable laws</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Reputation System</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            HeapFlow uses a reputation system to recognize community contributions. Reputation is
                            earned through positive interactions such as receiving upvotes on questions and answers.
                            We reserve the right to adjust reputation scores in cases of abuse or manipulation.
                            Reputation cannot be transferred or sold.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Moderation</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to remove, edit, or close any content that violates these terms or
                            is otherwise inappropriate. We may suspend or terminate accounts that repeatedly violate
                            our policies. Moderation decisions are made at our discretion and are final.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            The HeapFlow name, logo, and all related graphics, icons, and service names are
                            trademarks of HeapFlow. You may not use our trademarks without prior written permission.
                            All code snippets shared on the platform are subject to the license specified by the
                            original author.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            HeapFlow is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either
                            express or implied. We do not guarantee the accuracy, completeness, or usefulness of any
                            content posted by users. Use of any code or advice from HeapFlow is at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            To the maximum extent permitted by law, HeapFlow shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages arising from your use of the
                            platform. Our total liability shall not exceed the amount you paid us in the past twelve
                            months, if any.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You agree to indemnify and hold harmless HeapFlow, its officers, directors, employees,
                            and agents from any claims, damages, losses, or expenses arising from your use of the
                            platform, your content, or your violation of these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may terminate or suspend your account at any time for violations of these terms or
                            for any other reason at our discretion. Upon termination, your right to use the platform
                            ceases immediately. Provisions that by their nature should survive termination will
                            remain in effect.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            These terms shall be governed by and construed in accordance with applicable laws,
                            without regard to conflict of law principles. Any disputes arising from these terms
                            or your use of HeapFlow shall be resolved through appropriate legal channels.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us through our
                            platform. We are committed to addressing your concerns and ensuring a positive
                            experience on HeapFlow.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
