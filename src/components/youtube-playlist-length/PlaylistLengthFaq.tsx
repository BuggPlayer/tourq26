import JsonLd from "@/components/JsonLd";

const FAQ_ITEMS = [
  {
    question: "What is a YouTube playlist length calculator?",
    answer:
      "It adds up the duration of every public video in a playlist (within the range you choose), using YouTube’s official data. You can also see totals at faster playback speeds and sort videos by length, date, or popularity.",
  },
  {
    question: "Which playlist links are supported?",
    answer:
      "Standard playlist URLs, short youtu.be-style links with a list parameter, and watch URLs that include list= are supported. The tool extracts the playlist ID and loads items in playlist order.",
  },
  {
    question: "Why are some videos missing from my results?",
    answer:
      "Private, deleted, or region-blocked videos may appear in the playlist on YouTube but cannot return full details through the API. Those slots are skipped and noted so your totals only reflect videos we could load.",
  },
  {
    question: "Do I need a YouTube API key to use this page?",
    answer:
      "You do not enter a key in the browser. The site owner configures YOUTUBE_API_KEY on the server. Queries run through a protected API route so the key is never exposed to clients.",
  },
  {
    question: "What does playback speed do?",
    answer:
      "It does not change the videos; it estimates how long it would take to watch the playlist if you play everything at that speed (for example, 2× halves the wall-clock time).",
  },
  {
    question: "Is my data stored?",
    answer:
      "Results may be cached briefly on the server and in your browser to save quota. Pinned playlists, recents, sort/speed preferences, and optional title copies stay only in your browser (localStorage). Clear site data to remove them, or use “Refresh (skip cache)” to force a new API fetch.",
  },
];

export function PlaylistLengthFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="ytpl-faq-heading" className="border-t border-border/60 pt-12">
      <JsonLd data={jsonLd} />
      <h2 id="ytpl-faq-heading" className="font-display text-2xl font-bold text-foreground">
        Frequently asked questions
      </h2>
      <dl className="mt-8 space-y-8">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-foreground">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
