import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readTestimonials } from "@/lib/content";
import { TestimonialsEditor } from "./TestimonialsEditor";

export default async function AdminTestimonialsPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  const items = await readTestimonials();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Testimonials</h1>
      <p className="mt-1 text-slate-400">Edit testimonials shown on the homepage. Save all at once.</p>
      <TestimonialsEditor initialItems={items} />
    </div>
  );
}
