import Footer from "@/components/Footer";
import { DevToolsAside } from "@/components/umbrella-tools/DevToolsAside";
import { DevToolsBreadcrumbs } from "@/components/umbrella-tools/DevToolsBreadcrumbs";
import { DevToolsMobileSection } from "@/components/umbrella-tools/DevToolsMobileSection";
import { DevToolsShellRoot } from "@/components/umbrella-tools/DevToolsShellRoot";
import { DevToolsToolFaq } from "@/components/umbrella-tools/DevToolsToolFaq";
import { DevToolsRelatedTools } from "@/components/umbrella-tools/DevToolsRelatedTools";
import { DevToolsSidebar } from "@/components/umbrella-tools/DevToolsSidebar";
import { DevToolsTopBar } from "@/components/umbrella-tools/DevToolsTopBar";
import { UMBRELLA_TOOLS, type UmbrellaTool } from "@/lib/umbrella-tools/tools-config";

export default function UmbrellaToolsLayout({
  children,
  relatedToolsOverride,
  hideRegistryFaq,
  catalogTools,
}: {
  children: React.ReactNode;
  /** When set (e.g. from admin overrides), related tools exclude disabled slugs. */
  relatedToolsOverride?: UmbrellaTool[];
  /** When true, omit built-in registry FAQ accordion (admin content replaces it). */
  hideRegistryFaq?: boolean;
  /** Tools shown in sidebar / mobile nav (e.g. feature-flag filtered). Defaults to full registry. */
  catalogTools?: UmbrellaTool[];
}) {
  const navCatalog = catalogTools ?? UMBRELLA_TOOLS;
  return (
    <DevToolsShellRoot>
      <DevToolsTopBar />

      <div className="mx-auto flex w-full max-w-[1680px] flex-1">
        <DevToolsAside>
          <DevToolsSidebar baseTools={navCatalog} />
        </DevToolsAside>

        <div className="min-w-0 flex-1">
          <DevToolsMobileSection baseTools={navCatalog} />

          <main className="px-4  py-6 sm:px-6 lg:px-10 lg:py-8">
            <DevToolsBreadcrumbs />
            {children}
            {hideRegistryFaq ? null : <DevToolsToolFaq />}
            <DevToolsRelatedTools relatedToolsOverride={relatedToolsOverride} />
          </main>
        </div>
      </div>

      <div className="shrink-0 border-t border-border/30">
        <Footer />
      </div>
    </DevToolsShellRoot>
  );
}
