import { useEffect, useState } from "react";

const readCssVar = (varName, fallback) => {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
};

export const useCssVarColor = (varName, fallback) => {
  const [value, setValue] = useState(() => readCssVar(varName, fallback));

  useEffect(() => {
    const update = () => setValue(readCssVar(varName, fallback));
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });

    return () => observer.disconnect();
  }, [varName, fallback]);

  return value;
};
