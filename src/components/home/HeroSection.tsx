import slugify from "@/utils/slugify";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { db } from "@/lib/prisma";

export default async function HeroSection() {
    const questions = await db.question.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
    });

    return (
        <HeroParallax
            products={questions.map(q => ({
                title: q.title,
                link: `/questions/${q.id}/${slugify(q.title)}`,
                thumbnail: q.imageUrl || "/placeholder.png",
            }))}
        />
    );
}