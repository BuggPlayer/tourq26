import MarketingHeader from "@/components/MarketingHeader";
import Footer from "@/components/Footer";
import { DevToolsSubNav } from "@/components/umbrella-tools/DevToolsSubNav";

export default function UmbrellaToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <div className="min-h-screen bg-background pt-28 sm:pt-32">
        {/* Slim section nav only — no second logo (main header already has site nav) */}
        <div className="border-b border-border/40 bg-surface/20">
          <div className="mx-auto flex max-w-6xl justify-center px-4 py-2 sm:px-6 lg:px-8">
            <DevToolsSubNav />
          </div>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">{children}</main>
      </div>
      <Footer />
    </>
  );
}
