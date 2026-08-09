import { useEffect, useState } from "react";

const detect = () => {
  if (typeof window === "undefined") return false;

  const prefersReduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const lowCores =
    typeof navigator !== "undefined" &&
    navigator.hardwareConcurrency !== undefined &&
    navigator.hardwareConcurrency <= 4;

  const lowMemory =
    typeof navigator !== "undefined" &&
    navigator.deviceMemory !== undefined &&
    navigator.deviceMemory <= 4;

  return Boolean(prefersReduced || lowCores || lowMemory);
};

export const usePrefersReducedMotionOrLowPower = () => {
  const [shouldReduce, setShouldReduce] = useState(detect);

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const handleChange = () => setShouldReduce(detect());
    mql?.addEventListener("change", handleChange);
    return () => mql?.removeEventListener("change", handleChange);
  }, []);

  return shouldReduce;
};
