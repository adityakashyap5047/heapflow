import { Marquee } from "@/components/magicui/marquee";
import { NeonGradientCard } from "../magicui/neon-gradient-card";

const features = [
  {
    title: "Ask & Answer Questions",
    description:
      "Post programming-related questions with rich text formatting. Use code snippets & images for better clarity.",
  },
  {
    title: "Reputation System",
    description:
      "Vote on the best answers. Earn reputation points & badges for contributing. Higher reputation unlocks privileges & trust in the community.",
  },
  {
    title: "Search & Discover Solutions",
    description:
      "Find the questions quickly and easily using tags and names. You can also see all the questions in the Question tab",
  },
  {
    title: "Tags & Categories",
    description:
      "Use tags like JavaScript, Python, React, AI, ML. Filter questions by topics of interest. Discover trending tags & discussions.",
  },
  {
    title: "Comment on Questions",
    description:
      "Ask for clarifications, provide feedback, or add more context to questions through comments. Keep discussions active and insightful.",
  },
  {
    title: "Engage with Community",
    description:
      "Comment, discuss, and collaborate on answers. Interact with developers to expand your knowledge and improve solutions.",
  },
];

export default function ScrollableMarqueeVertical() {
  return (
    <div className="relative flex w-[600px] h-[1000px] flex-col items-center justify-center overflow-hidden md:p-20 p-7">
      <Marquee vertical className="[--duration:25s]">
        {features.map((feature) => (
          <NeonGradientCard
            key={feature.title}
            className="max-w-sm items-center justify-center text-center"
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-xl font-medium text-[#2dd4cf]">
                  {feature.title}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-3 text-sm text-sky-500">
              {feature.description}
            </blockquote>
          </NeonGradientCard>
        ))}
      </Marquee>
    </div>
  );
}
