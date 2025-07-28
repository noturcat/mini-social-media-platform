import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import { fetchPostById } from "@/api/posts";
import { Post } from "@/types/post";
import Link from "next/link"; 

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Memoized loadPost to prevent useEffect warning
  const loadPost = useCallback(async () => {
    if (!id) return;

    try {
      const data = await fetchPostById(Number(id));
      setPost(data);
    } catch (err) {
      console.error("Failed to load post", err);
    } finally {
      setLoading(false);
    }
  }, [id]); // ✅ include `id` as dependency

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id, loadPost]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!post) return <p className="text-center">Post not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary rounded-lg shadow font-thin">
      <h1 className="text-2xl font-elegant text-scara-gold dark:text-scara-gold mb-4">
        📌 {post.title}
      </h1>

      <p className="text-sm text-wanderer-text dark:text-white whitespace-pre-wrap break-words">
        {post.body}
      </p>

      {post.image_url && (
        <div className="mt-4 flex justify-center">
          <img
            src={post.image_url || "/uploads/tignari.png"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/uploads/tignari.png";
            }}
            alt="Post"
            className="w-24 h-24 rounded-full object-cover"
          /> 
        </div>
      )}

      {post.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded bg-wanderer-accent/10 dark:bg-scara-primary/20 text-wanderer-accent dark:text-scara-accent"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 text-right">
        <Link href="/">
          <span className="text-sm text-blue-500 hover:underline">← Back to Posts</span>
        </Link>
      </div>
    </div>
  );
}
