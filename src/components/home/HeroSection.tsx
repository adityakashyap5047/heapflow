import slugify from "@/utils/slugify";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { getQuestions } from "@/actions/questions";

export default async function HeroSection() {
    const result = await getQuestions({ page: 1, limit: 15,});
    const questions = result.success && result.data ? result.data.questions : [];

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