"use client";
import { LineShadowText } from "../magicui/line-shadow-text";
import { Particles } from "../magicui/particles";
import { SparklesText } from "../magicui/sparkles-text";
import ScrollableMarquee from "./ScrollableMarquee";
import ScrollableMarqueeVertical from "./ScrollableMarqueeVertical";

const HeroSectionHeader = () => {

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <Particles
                className="fixed inset-0 h-full w-full"
                quantity={500}
                ease={100}
                color="#ffffff"
                refresh
            />
            <div className="relative z-10 pt-20">
                <div className="flex items-center justify-center">
                    <div className="space-y-4 md:space-y-10 text-center">
                        <h1 className="pointer-events-none z-10 whitespace-pre-wrap bg-linear-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-5xl md:text-7xl font-bold leading-none tracking-tighter text-transparent">
                            HeapFlow
                        </h1>
                        <SparklesText className="text-center text-lg md:text-xl font-medium leading-7 text-gray-300">
                            Join a community of developers to ask questions, share insights, and help others solve coding challenges.
                        </SparklesText>
                        <LineShadowText className="text-center text-sm md:text-xl text-gray-400 leading-6 italic" shadowColor="white">
                            “Sharing knowledge is the most fundamental act of friendship. Because it is a way you can give something without losing something.”
                        </LineShadowText>
                        <p className="text-end text-sm md:text-xl leading-none">
                            <strong className="text-gray-300"> — Richard Stallman</strong>
                        </p>
                    </div>
                </div>

            </div>
            <div className="hidden md:flex"><ScrollableMarquee /></div>
            <div className="flex md:hidden justify-center items-center"><ScrollableMarqueeVertical /></div>
        </div>
    );
};

export default HeroSectionHeader;