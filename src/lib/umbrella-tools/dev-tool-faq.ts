import { getDevToolBySlug } from "@/lib/umbrella-tools/tools-config";

const DEFAULT_FAQ: { question: string; answer: string }[] = [
  {
    question: "Does this developer tool upload my input to your servers?",
    answer:
      "No. These utilities run in your web browser. Your text is processed locally in this tab unless a tool explicitly states otherwise (for example, fetching your public IP uses a minimal server request).",
  },
  {
    question: "Do I need an account to use this tool?",
    answer: "No account or sign-up is required. Open the tool and use it directly.",
  },
  {
    question: "Is this developer tool free to use?",
    answer:
      "Yes. Standard use is free in the browser. We may show optional support links, but core formatting, conversion, and generation features do not require payment.",
  },
  {
    question: "Which browsers work best?",
    answer:
      "Use a current version of Chrome, Firefox, Safari, or Edge. Very old browsers may lack APIs some tools need (for example secure clipboard or file reading).",
  },
  {
    question: "Can I use a tool offline after the page loads?",
    answer:
      "Many tools run entirely in your browser after load, so they can work without further network access. Anything that fetches remote data (such as a public IP lookup) needs a connection only for that request.",
  },
];

/** Per-slug FAQ merged after defaults (tool-specific questions first when provided). */
const SLUG_FAQ: Record<string, { question: string; answer: string }[]> = {
  "json-formatter": [
    {
      question: "What does this JSON formatter do?",
      answer:
        "It parses your text with JSON.parse, then either pretty-prints it with indentation (Format or Validate), or outputs a compact single line (Minify). If the text is not valid JSON, you see an error message instead of output.",
    },
    {
      question: "What is the difference between Format and Minify?",
      answer:
        "Format and Validate both produce indented, readable JSON with 2-space indentation. Minify removes unnecessary whitespace and line breaks so the same data takes fewer characters — useful for logs or size-sensitive payloads.",
    },
    {
      question: "Why does my JSON fail validation?",
      answer:
        "JSON must follow strict rules: double quotes around keys and strings, no trailing commas in objects or arrays, and no comments. The error text usually points to the position or nature of the problem (for example an unexpected token).",
    },
    {
      question: "Can I load a file instead of pasting?",
      answer:
        "Yes. Use Upload file to read a .json or .txt file from your device into the input editor. Then run Format, Minify, or Validate as usual.",
    },
    {
      question: "How do I save the formatted result?",
      answer:
        "Use Copy to put the output on the clipboard, or Download to save it as formatted.json. You can also select the output text manually.",
    },
  ],
  "slug-generator": [
    {
      question: "What is a URL slug?",
      answer:
        "It is the readable segment of a page’s address after the domain, usually lowercase words separated by hyphens (for example /seo-tips-2025-ultimate-guide). It names the page in the URL instead of using only numbers or IDs.",
    },
    {
      question: "Why are slugs important for SEO?",
      answer:
        "They let you use clear, keyword-rich paths that match what people search for, improve click-through from results, and keep URLs easy to share and remember — all without changing how your site works technically.",
    },
    {
      question: "Can I change a slug after publishing?",
      answer:
        "Yes, but the old URL will stop working unless you add a redirect. Changing slugs can cause broken links and temporary ranking fluctuations, so plan redirects (301) and update internal links when you rename important pages.",
    },
    {
      question: "Should slugs be lowercase?",
      answer:
        "Yes. Lowercase avoids duplicate URLs that differ only by case, matches common convention, and keeps links consistent when shared or typed.",
    },
    {
      question: "How long should a slug be?",
      answer:
        "Short enough to read at a glance — often three to five words. Include the main topic and year or qualifier if useful; avoid stuffing keywords or making the path longer than it needs to be.",
    },
  ],
};

export function getDevToolFaqItems(slug: string): { question: string; answer: string }[] {
  const tool = getDevToolBySlug(slug);
  const extra = [...(tool?.faq ?? []), ...(SLUG_FAQ[slug] ?? [])];
  const seen = new Set<string>();
  const merged: { question: string; answer: string }[] = [];
  for (const item of [...extra, ...DEFAULT_FAQ]) {
    const key = item.question.trim();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
}
