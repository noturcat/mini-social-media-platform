import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchBlogById } from "@/api/blogs";
import { Blog } from "@/types/blog";
import Link from 'next/link';

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogById(Number(id))
        .then(setBlog)
        .catch(() => setBlog(null))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!blog) return <p className="text-center">Blog not found</p>;

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6 bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary rounded-lg shadow font-thin text-wanderer-text dark:text-white">
      <h1 className="text-2xl font-elegant text-scara-gold dark:text-scara-gold mb-2">
        📰 {blog.title}
      </h1>
      <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">{blog.summary}</p>
      <p className="text-sm whitespace-pre-wrap break-words">{blog.body}</p>

      <div className="mt-6 text-right">
        <Link href="/blogs" className="text-sm text-blue-500 hover:underline">
          ← Back to Blogs
        </Link>
      </div>
    </main>
  );
}
