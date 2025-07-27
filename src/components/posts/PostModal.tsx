import { useState } from "react";
import { createPost } from "@/api/posts";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostModal({ isOpen, onClose }: PostModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async () => {
    if (!body) return;
    await createPost({ title, body, tags: [] });
    setTitle("");
    setBody("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center md:hidden">
      <div className="bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary text-wanderer-text dark:text-white p-6 w-full mx-4 rounded-lg shadow-lg relative max-w-md font-thin transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-wanderer-accent dark:text-scara-gold hover:text-black dark:hover:text-white"
        >
          ×
        </button>

        <h2 className="text-lg font-elegant mb-4 text-scara-gold dark:text-scara-gold">
          What&apos;s happening?
        </h2>

        <input
          type="text"
          placeholder="Title (optional)"
          className="w-full mb-2 p-2 border border-wanderer-border dark:border-scara-primary bg-transparent rounded text-sm placeholder-wanderer-accent dark:placeholder-scara-accent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Share your thoughts..."
          className="w-full p-2 border border-wanderer-border dark:border-scara-primary bg-transparent rounded text-sm resize-none placeholder-wanderer-accent dark:placeholder-scara-accent"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-wanderer-accent dark:bg-scara-primary hover:bg-wanderer-hover dark:hover:bg-scara-accent text-white py-2 rounded font-elegant transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}
