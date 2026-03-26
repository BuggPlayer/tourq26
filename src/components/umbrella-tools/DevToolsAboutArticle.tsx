"use client";

import Link from "next/link";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";

export function DevToolsAboutArticle() {
  const { messages: m } = useDevToolsLocale();

  return (
    <>
      <header className="mb-10 max-w-2xl border-b border-border/40 pb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{m.aboutPage.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{m.aboutPage.lead}</p>
      </header>
      <article className="blog-article max-w-2xl text-[1.02rem]">
        <p>{m.aboutPage.p1}</p>
        <p>
          {m.aboutPage.p2BeforePrivacy}{" "}
          <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
            {m.aboutPage.privacyLink}
          </Link>{" "}
          {m.aboutPage.p2AfterPrivacy}
        </p>
        <p>
          <Link href="/dev-tools" className="font-medium text-primary underline-offset-2 hover:underline">
            {m.aboutPage.backLink}
          </Link>
        </p>
      </article>
    </>
  );
}
