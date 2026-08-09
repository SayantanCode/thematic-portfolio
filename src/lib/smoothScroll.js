import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export const getLenis = () => lenisInstance;

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Late-loading images (e.g. the profile photo) can shift section heights
    // after ScrollTrigger's initial measurement — re-measure once everything settles.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener("load", onLoad);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
};
