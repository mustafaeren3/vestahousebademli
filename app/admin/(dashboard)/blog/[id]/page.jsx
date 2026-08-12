import { notFound } from "next/navigation";
import BlogEditor from "@/components/admin/blog/BlogEditor";
import { getAdminBlogPostById } from "@/lib/blog/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yazı Düzenle" };

export default async function AdminBlogEditPage({ params }) {
  const post = await getAdminBlogPostById(params.id);
  if (!post) notFound();

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Yazı Düzenle
      </h2>
      <BlogEditor post={post} />
    </div>
  );
}
