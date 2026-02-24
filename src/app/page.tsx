import HeroSection from "@/components/home/HeroSection";
import HeroSectionHeader from "@/components/home/HeroSectionHeader";
import LatestQuestions from "@/components/home/LatestQuestions";
import TopContributers from "@/components/home/TopContributors";

export default function Home() {
  return (
    <>
      <HeroSectionHeader />
      <HeroSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-8">
        <div className="col-span-1 lg:col-span-2">
          <p className="text-2xl py-4">Questions</p>
          <LatestQuestions />
        </div>

        <div className="col-span-2 lg:col-span-1">
          <p className="text-2xl py-4">Contributers</p>
          <TopContributers />
        </div>
      </div>
    </>
  );
}