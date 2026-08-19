export const hexToRgb = (hex) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const bigint = parseInt(full, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

export const interpolateColor = (hexA, hexB, t) => {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

/** Mixes a hex color toward white by `amount` (0-1). */
export const lighten = (hex, amount) => interpolateColor(hex, "#ffffff", amount);

/** Mixes a hex color toward black by `amount` (0-1). */
export const darken = (hex, amount) => interpolateColor(hex, "#000000", amount);

/** Hex -> { h: 0-360, s: 0-1, l: 0-1 }. */
export const hexToHsl = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) return { h: 0, s: 0, l };

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h;
  switch (max) {
    case r:
      h = 60 * (((g - b) / delta) % 6);
      break;
    case g:
      h = 60 * ((b - r) / delta + 2);
      break;
    default:
      h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;
  return { h, s, l };
};
