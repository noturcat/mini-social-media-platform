import { useState } from "react";
import { createBlog } from "@/api/blogs";
import { successSwal, errorSwal } from "@/utils/swal";

export default function ComposeBlogBar({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async () => {
    if (!title || !body) return errorSwal("Title and Body are required");

    try {
      await createBlog({ title, summary, body });
      await successSwal("Blog posted!");
      setTitle("");
      setSummary("");
      setBody("");
      onCreated();
    } catch {
      errorSwal("Failed to create blog.");
    }
  };

  return (
    <div className="hidden md:block p-4 mb-6 rounded-lg shadow border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg text-wanderer-text dark:text-white font-thin transition-colors duration-300">
      <h2 className="text-lg font-elegant text-scara-gold mb-3">Write a Blog</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full mb-2 p-2 border rounded text-sm bg-transparent placeholder-wanderer-accent dark:placeholder-scara-accent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Summary (optional)"
        className="w-full mb-2 p-2 border rounded text-sm bg-transparent placeholder-wanderer-accent dark:placeholder-scara-accent"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <textarea
        placeholder="Body"
        rows={4}
        className="w-full p-2 border rounded text-sm resize-none bg-transparent placeholder-wanderer-accent dark:placeholder-scara-accent"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="mt-4 text-right">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-wanderer-accent dark:bg-scara-primary hover:bg-wanderer-hover dark:hover:bg-scara-accent text-white rounded font-elegant transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}
