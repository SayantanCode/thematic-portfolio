import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "@/features/hero/Hero.jsx";
import { StatsBar } from "@/features/about/StatsBar.jsx";
import { SkillsGrid } from "@/features/skills/SkillsGrid.jsx";
import { FeaturedProjects } from "@/features/projects/FeaturedProjects.jsx";
import { JourneyTimeline } from "@/features/journey/JourneyTimeline.jsx";
import { GlobalCollab } from "@/features/collab/GlobalCollab.jsx";
import { GitHubFootprint } from "@/features/github/GitHubFootprint.jsx";
import { LatestWriting } from "@/features/blog/LatestWriting.jsx";
import { Footer } from "@/layouts/MainLayout/Footer.jsx";
import { ScrollDissolve } from "@/shared/components/ScrollDissolve.jsx";
import { ScrollFade } from "@/shared/components/ScrollFade.jsx";
import { scrollToSection } from "@/shared/hooks/useSectionScroll.js";

export const HomePage = () => {
  const location = useLocation();

  // Sidebar.jsx routes here with { state: { scrollTo: id } } when a
  // scroll-nav item is clicked from a different route (e.g. /blog) — this
  // is the other half of that handoff, run once the homepage has mounted.
  // A single rAF isn't enough of a delay: Lenis (smoothScroll.js) still has
  // the previous, shorter route's document height cached at that point and
  // clamps scrollTo's target short — same class of "let layout settle
  // first" issue ScrollFade already works around with its own settle timer.
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const timer = setTimeout(() => scrollToSection(target), 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
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
      <ScrollFade>
        <LatestWriting />
      </ScrollFade>
      <ScrollFade isLast>
        <Footer />
      </ScrollFade>
    </>
  );
};
