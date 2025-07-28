import { Post } from "@/types/post";
import { summarizeText } from "@/utils/summarize";
import { useState, useEffect } from "react";
import { showSummarySwal, errorSwal } from "@/utils/swal";
import Link from "next/link";
import Image from "next/image";

interface PostCardProps {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Get the current user ID from localStorage
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
    <div className="bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary text-wanderer-text dark:text-white p-4 rounded-lg mb-4 shadow transition-colors duration-300 font-thin">
      <h2 className="text-xl font-elegant text-scara-gold dark:text-scara-gold">
        {post.title}
      </h2>

      <p className="mt-1 text-sm">{post.body}</p>

      {post.image_url && (
        <div className="mt-3 flex justify-center">
          <Image
            src={post.image_url || "/uploads/tignari.png"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/uploads/tignari.png";
            }}
            alt="Post"
            className="w-24 h-24 rounded-full object-cover"
            width={96}
            height={96}
          />
        </div>
      )}

      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
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

      <div className="mt-4 flex gap-4 text-sm justify-end">
        <Link href={`/posts/${post.id}`} key={post.id}>
          <button className="text-wanderer-primary dark:text-scara-card hover:underline">
            View
          </button>
        </Link>

        <button
          onClick={() => handleSummarize(post.body)}
          className="text-wanderer-bg dark:text-scara-gold hover:underline"
        >
          Summarize
        </button>

        {currentUserId == post.person_id && onEdit && (
          <button
            onClick={onEdit}
            className="text-wanderer-accent dark:text-scara-accent hover:underline"
          >
            Edit
          </button>
        )}

        {currentUserId == post.person_id && onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 dark:text-red-400 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
