import { useEffect, useState } from "react";

const DEFAULT_IDS = ["home", "about", "skills", "projects", "journey", "contact"];

/**
 * Tracks which section id is currently "active" by watching a thin band near
 * the upper-middle of the viewport — whichever section occupies that band
 * wins, which reads naturally as you scroll (used to highlight sidebar nav).
 */
export const useActiveSection = (ids = DEFAULT_IDS) => {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return activeId;
};
