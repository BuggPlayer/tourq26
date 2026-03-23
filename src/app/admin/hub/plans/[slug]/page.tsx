import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/hub/prisma";
import { PlanForm } from "../PlanForm";

type Props = { params: Promise<{ slug: string }> };

export default async function EditPlanPage({ params }: Props) {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const { slug } = await params;
  const plan = await prisma.preparationPlan.findUnique({
    where: { slug: decodeURIComponent(slug) },
  });
  if (!plan) redirect("/admin/hub/plans");

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Edit plan</h1>
      <p className="mt-1 font-mono text-sm text-slate-500">{plan.slug}</p>
      <PlanForm
        initial={{
          slug: plan.slug,
          name: plan.name,
          description: plan.description,
          durationDays: plan.durationDays,
          milestones: plan.milestones,
          sortOrder: plan.sortOrder,
        }}
      />
    </div>
  );
}
