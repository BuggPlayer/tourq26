"use client";

import Link from "next/link";
import { useDevToolsLocale } from "@/components/umbrella-tools/DevToolsLocaleProvider";
import { getDevToolsHrefForLocale } from "@/lib/dev-tools-locale-path";

export function DevToolsAboutArticle() {
  const { messages: m, locale } = useDevToolsLocale();

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
          <Link href={getDevToolsHrefForLocale("/dev-tools", locale)} className="font-medium text-primary underline-offset-2 hover:underline">
            {m.aboutPage.backLink}
          </Link>
        </p>
        {m.aboutPage.p3 ? <p>{m.aboutPage.p3}</p> : null}
        {m.aboutPage.p4 ? <p>{m.aboutPage.p4}</p> : null}
        {m.aboutPage.p5 ? <p>{m.aboutPage.p5}</p> : null}
        {m.aboutPage.p6 ? <p>{m.aboutPage.p6}</p> : null}
      </article>
    </>
  );
}
