import { flushSync } from "react-dom";

// Reads a theme's `--is-light` without actually applying it: a hidden probe
// element gets the same data-theme attribute (and, for custom themes, the
// same inline CSS variables) applyTheme() would set on <html>, so it picks
// up the exact value the real cascade would produce — no hardcoded
// light/dark table to keep in sync with globals.css.
function probeIsLight(theme) {
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;";

  if (theme.type === "preset") {
    probe.setAttribute("data-theme", theme.name);
  } else if (theme.type === "custom") {
    probe.setAttribute("data-theme", "custom");
    Object.entries(theme.config.variables).forEach(([key, value]) => {
      probe.style.setProperty(`--${key}`, value);
    });
  }

  document.body.appendChild(probe);
  const isLight = getComputedStyle(probe).getPropertyValue("--is-light").trim() === "1";
  document.body.removeChild(probe);
  return isLight;
}

// probeIsLight() forces a synchronous style recalculation. Sharing a click
// handler with panel.close() — even just before it, even deferred a frame
// after it — was enough to make Framer Motion's exit animation collapse to
// a 0ms duration (confirmed via document.getAnimations()); the panel's own
// toggle button, whose handler does nothing but close(), animated fine. A
// theme's light/dark-ness never changes at runtime, so cache it and warm
// the cache when the panel opens (see warmIsLightCache) — by the time a
// swatch is actually clicked, resolveIsLight is a plain lookup, no DOM
// touched, no reflow sharing the handler with close() at all.
const isLightCache = new Map();

function themeCacheKey(theme) {
  return theme.type === "preset" ? `preset:${theme.name}` : `custom:${theme.id ?? JSON.stringify(theme.config?.variables)}`;
}

function resolveIsLight(theme) {
  const key = themeCacheKey(theme);
  if (isLightCache.has(key)) return isLightCache.get(key);
  const result = probeIsLight(theme);
  isLightCache.set(key, result);
  return result;
}

// Call once (e.g. when the theme panel opens) to pre-resolve every theme's
// light/dark-ness ahead of any click, so the actual click handler never
// forces a reflow itself.
export function warmIsLightCache(themes) {
  themes.forEach((theme) => resolveIsLight(theme));
}

// Exposed separately so callers (ThemeSwitcher) can decide *before* running
// the swap whether it'll cross the light/dark boundary — e.g. to choose
// how long to wait before applying it.
export function crossesLightDarkBoundary(fromTheme, toTheme) {
  const fromIsLight = fromTheme
    ? resolveIsLight(fromTheme)
    : getComputedStyle(document.documentElement).getPropertyValue("--is-light").trim() === "1";
  const toIsLight = toTheme ? resolveIsLight(toTheme) : fromIsLight;
  return fromIsLight !== toIsLight;
}

// Wraps a theme swap in the View Transitions API to produce a radial reveal
// expanding from `origin` (the click point), but only when the switch
// actually crosses the light/dark boundary — between two similarly-shaded
// themes the wipe barely reads and just looks like added lag, so those swap
// instantly via the normal CSS color transition instead.
export function radialThemeTransition(updateFn, { origin, fromTheme, toTheme } = {}) {
  const supportsViewTransitions = typeof document.startViewTransition === "function";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const crossesLightDark = crossesLightDarkBoundary(fromTheme, toTheme);

  if (!supportsViewTransitions || prefersReducedMotion || !crossesLightDark) {
    updateFn();
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // Every element on the page has its own `transition-colors` (globals.css)
  // for the normal instant-switch case. Left on, it fades in parallel with
  // the clip-path reveal on every single element at once — competing paint
  // work that's the actual source of the jank, not the reveal itself.
  const root = document.documentElement;
  root.classList.add("theme-radial-active");
  const clearGuard = () => root.classList.remove("theme-radial-active");

  const transition = document.startViewTransition(() => {
    flushSync(updateFn);
  });
  transition.finished.then(clearGuard, clearGuard);

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}
