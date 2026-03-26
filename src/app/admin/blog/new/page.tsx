import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { BlogPostForm } from "../BlogPostForm";

export default async function NewBlogPostPage() {
  const ok = await isAdmin();
  if (!ok) redirect("/admin");

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">New post</h1>
      <p className="mt-1 text-muted-foreground">Slug will be generated from title if left blank.</p>
      <BlogPostForm />
    </div>
  );
}
