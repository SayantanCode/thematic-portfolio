import sanitizeHtml from "sanitize-html";

// Blog posts are authored as raw HTML by the (sole, trusted) admin — this
// still runs server-side so the DB always holds clean HTML regardless of
// render path, and as defense-in-depth if the admin session is ever
// compromised. Mirrored on the frontend (shared/utils/sanitizeHtml.js,
// DOMPurify) for the live editor preview, which never touches this file.
const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4",
  "p", "a", "img", "div", "span",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "strong", "em", "b", "i", "br", "hr", "style",
];

const ALLOWED_ATTRIBUTES = {
  "*": ["class", "id", "style"],
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
};

export function sanitizeBlogHtml(html) {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    // sanitize-html doesn't parse @media rules out of <style> content — the
    // tag is allowed through as opaque text, which is what per-post scoped
    // CSS needs (see BlogPostPage.jsx's #post-{slug} wrapper).
    allowVulnerableTags: true,
    transformTags: {
      a: (tagName, attribs) =>
        attribs.target === "_blank"
          ? { tagName, attribs: { ...attribs, rel: "noopener noreferrer" } }
          : { tagName, attribs },
    },
  });
}
