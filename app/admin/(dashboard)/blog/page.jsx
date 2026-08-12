import BlogListManager from "@/components/admin/blog/BlogListManager";
import { getAdminBlogPosts } from "@/lib/blog/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  let posts = [];
  let dbError = null;

  try {
    posts = await getAdminBlogPosts();
  } catch (err) {
    dbError = err;
  }

  if (dbError) {
    return (
      <div className="admin-error">
        Veritabanına bağlanılamadı. <code>supabase/migrations/0008_blog_posts.sql</code>{" "}
        dosyasının uygulandığından emin olun.
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: 20 }}>
        Blog Yönetimi
      </h2>
      <BlogListManager posts={posts} />
    </div>
  );
}
