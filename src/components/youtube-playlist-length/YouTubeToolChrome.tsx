import Link from "next/link";

export { YouTubeToolHeader } from "./YouTubeToolHeaderBar";

export function YouTubeToolFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-border bg-background pb-[max(1rem,env(safe-area-inset-bottom))] pt-5">
      <div className="mx-auto max-w-5xl px-3 text-center text-xs text-muted-foreground sm:px-5">
        <p>
          © {year}{" "}
          <Link
            href="/"
            className="text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Torq Studio
          </Link>
        </p>
      </div>
    </footer>
  );
}
