// Lowercase, ASCII, hyphen-separated. Good enough for post titles — no need
// for a dependency (transliteration, unicode normalization) this codebase
// doesn't need.
export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
