import sanitizeHtml from "sanitize-html";

/** Quill Snow output + safe headings, lists, code blocks — no scripts or inline event handlers. */
const devToolEditorialOptions: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "h1",
    "h2",
    "h3",
    "h4",
    "span",
    "u",
    "pre",
    "code",
    "hr",
    "img",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    p: ["class"],
    span: ["class"],
    li: ["class"],
    ol: ["class"],
    ul: ["class"],
    pre: ["spellcheck", "class"],
    code: ["class"],
  },
  allowedClasses: {
    p: [/^ql-/],
    span: [/^ql-/],
    li: [/^ql-/],
    ol: [/^ql-/],
    ul: [/^ql-/],
    pre: [/^ql-/],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitizeDevToolEditorialHtml(html: string): string {
  return sanitizeHtml(html || "", devToolEditorialOptions);
}

const plainTitleOptions: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

/** Section titles are plain text (no HTML). */
export function sanitizeDevToolSectionTitle(title: string): string {
  return sanitizeHtml(title || "", plainTitleOptions).trim().slice(0, 200);
}
