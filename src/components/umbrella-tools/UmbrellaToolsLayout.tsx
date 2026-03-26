import Footer from "@/components/Footer";
import { DevToolsBreadcrumbs } from "@/components/umbrella-tools/DevToolsBreadcrumbs";
import { DevToolsMobileNav } from "@/components/umbrella-tools/DevToolsMobileNav";
import { DevToolsSidebar } from "@/components/umbrella-tools/DevToolsSidebar";
import { DevToolsTopBar } from "@/components/umbrella-tools/DevToolsTopBar";

export default function UmbrellaToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DevToolsTopBar />

      <div className="mx-auto flex w-full max-w-[1680px] flex-1">
        {/* Desktop sidebar */}
        <aside
          className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-[min(100%,18rem)] shrink-0 flex-col border-r border-border/50 bg-surface/50 sm:top-[3.75rem] sm:h-[calc(100vh-3.75rem)] lg:flex"
          aria-label="Tool categories"
        >
          <DevToolsSidebar />
        </aside>

        <div className="min-w-0 flex-1">
          {/* Mobile browse panel */}
          <details className="group border-b border-border/50 bg-surface/30 lg:hidden">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                Browse tools
                <span className="text-muted-foreground transition-transform group-open:rotate-180">▼</span>
              </span>
            </summary>
            <div className="max-h-[min(55vh,480px)] overflow-y-auto border-t border-border/40">
              <DevToolsMobileNav />
            </div>
          </details>

          <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <DevToolsBreadcrumbs />
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
