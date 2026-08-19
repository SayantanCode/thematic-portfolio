import DOMPurify from "dompurify";

// Mirrors backend/shared/utils/sanitizeHtml.js's allow-list exactly — same
// mental model on both sides so the admin preview never drifts from what
// the public page actually renders. Runs here too (not just server-side on
// save) because the editor preview shows unsaved content that hasn't been
// through the backend sanitizer yet.
const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4",
  "p", "a", "img", "div", "span",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "table", "thead", "tbody", "tr", "th", "td",
  "strong", "em", "b", "i", "br", "hr", "style",
];

const ALLOWED_ATTR = [
  "class", "id", "style",
  "href", "title", "target", "rel",
  "src", "alt",
  "colspan", "rowspan",
];

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export function sanitizeBlogHtml(html) {
  return DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
