import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { DevToolsAdminPanel } from "./DevToolsAdminPanel";

export default async function AdminDevToolsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Developer tools</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Operational control for the public dev-tools catalog: visibility, featured hub placement, notes, and per-tool
        detail pages with blog-style FAQ editor and live preview. Registry entries remain in code — deploy to add or
        remove tools permanently.
      </p>
      <div className="mt-8">
        <DevToolsAdminPanel />
      </div>
    </div>
  );
}
