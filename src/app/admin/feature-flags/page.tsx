import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { FeatureFlagsForm } from "./FeatureFlagsForm";
import { AdminPageHeader } from "../AdminPageHeader";

export default async function AdminFeatureFlagsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  return (
    <div>
      <AdminPageHeader
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Feature flags" },
        ]}
        title="Feature flags"
        description="Control marketing sections and maintenance without redeploying (unless an env override is set)."
      />
      <div className="mt-8">
        <FeatureFlagsForm />
      </div>
    </div>
  );
}
