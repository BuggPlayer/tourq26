import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readTestimonials } from "@/lib/content";
import { TestimonialsEditor } from "./TestimonialsEditor";
import { AdminPageHeader } from "../AdminPageHeader";

export default async function AdminTestimonialsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const items = await readTestimonials();

  return (
    <div>
      <AdminPageHeader
        crumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Testimonials" },
        ]}
        title="Testimonials"
        description="Edit testimonials shown on the homepage. Save all at once."
      />
      <TestimonialsEditor initialItems={items} />
    </div>
  );
}
