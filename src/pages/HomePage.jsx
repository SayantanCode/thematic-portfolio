import { Hero } from "@/features/hero/Hero.jsx";
import { StatsBar } from "@/features/about/StatsBar.jsx";
import { SkillsGrid } from "@/features/skills/SkillsGrid.jsx";
import { FeaturedProjects } from "@/features/projects/FeaturedProjects.jsx";
import { JourneyTimeline } from "@/features/journey/JourneyTimeline.jsx";
import { GlobalCollab } from "@/features/collab/GlobalCollab.jsx";
import { GitHubFootprint } from "@/features/github/GitHubFootprint.jsx";
import { Footer } from "@/layouts/MainLayout/Footer.jsx";
import { ScrollDissolve } from "@/shared/components/ScrollDissolve.jsx";
import { ScrollFade } from "@/shared/components/ScrollFade.jsx";

export const HomePage = () => (
  <>
    <ScrollDissolve isFirst>
      <Hero />
    </ScrollDissolve>
    <ScrollDissolve>
      <StatsBar />
    </ScrollDissolve>
    <ScrollFade>
      <SkillsGrid />
    </ScrollFade>
    <ScrollFade>
      <FeaturedProjects />
    </ScrollFade>
    <ScrollFade>
      <JourneyTimeline />
    </ScrollFade>
    <ScrollFade>
      <GlobalCollab />
    </ScrollFade>
    <ScrollDissolve>
      <GitHubFootprint />
    </ScrollDissolve>
    <ScrollFade isLast>
      <Footer />
    </ScrollFade>
  </>
);
