import Footer from "@/components/Footer";
import { DevToolsBreadcrumbs } from "@/components/umbrella-tools/DevToolsBreadcrumbs";
import { DevToolsDesktopShell } from "@/components/umbrella-tools/DevToolsDesktopShell";
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

      <DevToolsDesktopShell sidebar={<DevToolsSidebar baseTools={navCatalog} />}>
        <div className="min-w-0 flex-1 max-w-full">
          <DevToolsMobileSection baseTools={navCatalog} />

          <main className="w-full min-w-0 max-w-full py-6 ps-[max(1rem,env(safe-area-inset-left,0px))] pe-[max(1rem,env(safe-area-inset-right,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:py-6 sm:ps-6 sm:pe-6 lg:py-8 lg:ps-10 lg:pe-10">
            <DevToolsBreadcrumbs />
            {children}
            {hideRegistryFaq ? null : <DevToolsToolFaq />}
            <DevToolsRelatedTools relatedToolsOverride={relatedToolsOverride} />
          </main>
        </div>
      </DevToolsDesktopShell>

      <div className="shrink-0 border-t border-border/30">
        <Footer />
      </div>
    </DevToolsShellRoot>
  );
}
