import { useEffect, useState } from "react"; 
import { Blog } from "@/types/blog";
import ComposeBlogBar from "@/components/blogs/ComposeBlogBar";
import FloatingCreateButton from "@/components/shared/FloatingCreateButton";
import BlogModal from "@/components/blogs/BlogModal";
import { showSummarySwal, successSwal, errorSwal, confirmSwal, editBlogSwal } from "@/utils/swal";
import { summarizeText } from "@/utils/summarize";
import Link from "next/link";

// API
import { fetchBlogs, deleteBlog } from "@/api/blogs";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // SSR-safe: Only runs in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUserId(user.id);
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      const data = await fetchBlogs();
      setBlogs(data);
    };
    loadBlogs();
  }, []); 

  const loadBlogs = async () => {
    const data = await fetchBlogs();
    setBlogs(data);
  }; 
  
  const handleDelete = async (id: number) => {
    const result = await confirmSwal("This post will be permanently deleted.");

    if (result.isConfirmed) {
      try {
        await deleteBlog(id);
        successSwal("Post deleted.");
        loadBlogs(); // refresh
      } catch (err) {
        errorSwal("Failed to delete post.");
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    }
  };

  const handleEdit = async (post: Blog) => {
    await editBlogSwal(post, loadBlogs); // 🔁 reload after editing
  };

  const handleSummarize = async (content: string) => {
    try {
      setLoading(true);
      const summary = await summarizeText(content);
      await showSummarySwal(summary);
    } catch (error) {
      console.error("Summarization failed:", error);
      await errorSwal("Something went wrong while summarizing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-4 font-thin text-wanderer-text dark:text-white transition-colors duration-300">
      {/* Desktop composer */}
      <ComposeBlogBar onCreated={loadBlogs} />

      <h1 className="text-2xl font-elegant text-scara-gold dark:text-scara-gold mb-4">
        Blogs
      </h1>

      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="p-4 mb-4 rounded-lg shadow border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg transition-all"
        >
          <h2 className="text-lg font-elegant text-wanderer-text dark:text-scara-gold">{blog.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">{blog.summary}</p>
          <p className="mt-2 text-sm text-gray-800 dark:text-white">{blog.body}</p>

          <div className="flex justify-end gap-3 mt-3">
            <Link href={`/blogs/${blog.id}`} key={blog.id}>
              <button className="text-wanderer-primary dark:text-scara-card hover:underline">
                View
              </button>
            </Link>

            <button
              onClick={() => handleSummarize(blog.body)}
              className="text-wanderer-bg dark:text-scara-gold hover:underline"
            >
              Summarize
            </button>

            {currentUserId === blog.person_id && (
              <>
                <button
                  onClick={() => handleEdit(blog)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Mobile view */}
      <FloatingCreateButton onClick={() => setIsOpen(true)} />
      <BlogModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}
