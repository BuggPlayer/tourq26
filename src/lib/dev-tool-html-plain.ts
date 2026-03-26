/** Strip tags for FAQPage / meta; keeps crawlable text for schema.org `Answer.text`. */
export function htmlToPlainTextForSchema(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}
