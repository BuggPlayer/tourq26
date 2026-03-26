import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { FeatureFlagsForm } from "./FeatureFlagsForm";

export default async function AdminFeatureFlagsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Feature flags</h1>
      <p className="mt-1 text-slate-400">
        Control marketing sections and maintenance without redeploying (unless an env override is set).
      </p>
      <div className="mt-8">
        <FeatureFlagsForm />
      </div>
    </div>
  );
}
