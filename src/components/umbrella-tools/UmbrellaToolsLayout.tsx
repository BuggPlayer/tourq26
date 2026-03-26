import Footer from "@/components/Footer";
import { DevToolsBreadcrumbs } from "@/components/umbrella-tools/DevToolsBreadcrumbs";
import { DevToolsMobileSection } from "@/components/umbrella-tools/DevToolsMobileSection";
import { DevToolsRelatedTools } from "@/components/umbrella-tools/DevToolsRelatedTools";
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
          <DevToolsMobileSection />

          <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <DevToolsBreadcrumbs />
            {children}
            <DevToolsRelatedTools />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
