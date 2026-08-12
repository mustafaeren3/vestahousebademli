// Public API for blog content, now backed by the `blog_posts` table instead
// of content/blog/*.md. Every function here used to be synchronous
// (filesystem read); they're all async now since they hit the database --
// every call site was updated to `await` them accordingly.
export {
  getAllPosts,
  getPostBySlug,
  getAllCategories,
  getAllTags,
  categorySlug,
  tagSlug,
  getPostsByCategory,
  getPostsByTag,
  getRelatedPosts,
  searchPosts,
} from "./queries";
