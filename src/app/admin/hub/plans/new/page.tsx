import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { PlanForm } from "../PlanForm";

export default async function NewPlanPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">New preparation plan</h1>
      <PlanForm />
    </div>
  );
}
