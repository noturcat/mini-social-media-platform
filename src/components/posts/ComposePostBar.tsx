import { useState } from "react";
import { createPost } from "@/api/posts";
import { successSwal, errorSwal } from "@/utils/swal";
import Image from 'next/image';

export default function ComposePostBar({ onPostCreated }: { onPostCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim()) return errorSwal("Post content is required");

    try {
      setLoading(true);
      let image_url = "";

      // upload image if selected
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Image upload failed");

        image_url = data.path; // ← path to send to Laravel
      }

      await createPost({ title, body, tags, image_url });
      await successSwal("Post created!");
      setTitle("");
      setBody("");
      setTags([]);
      setImage(null);
      setPreviewUrl("");
      onPostCreated();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        console.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value.trim();

    if ((e.key === "Enter" || e.key === ",") && value) {
      e.preventDefault();
      if (!tags.includes(value)) {
        setTags([...tags, value]);
      }
      input.value = "";
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="hidden md:block p-4 mb-6 rounded-lg shadow border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg text-wanderer-text dark:text-white font-thin transition-colors duration-300">
      <h2 className="text-lg font-elegant text-scara-gold dark:text-scara-gold mb-3">
        What&apos;s happening?
      </h2>

      <input
        type="text"
        placeholder="Title (optional)"
        className="w-full mb-2 p-2 bg-transparent border border-wanderer-border dark:border-scara-primary rounded text-sm placeholder-wanderer-accent dark:placeholder-scara-accent"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Share your thoughts..."
        className="w-full p-2 bg-transparent border border-wanderer-border dark:border-scara-primary rounded text-sm resize-none placeholder-wanderer-accent dark:placeholder-scara-accent"
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      {/* Tags Section */}
      <div className="mb-2 mt-3">
        <label className="block text-sm font-medium mb-1 text-scara-gold dark:text-scara-gold">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-wanderer-hover dark:bg-scara-primary text-white text-xs px-2 py-1 rounded flex items-center"
            >
              {tag}
              <button
                type="button"
                className="ml-1 text-white hover:text-red-300"
                onClick={() => handleRemoveTag(index)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Press Enter or comma to add tag"
          className="w-full p-2 bg-transparent border border-wanderer-border dark:border-scara-primary rounded text-sm placeholder-wanderer-accent dark:placeholder-scara-accent"
          onKeyDown={handleTagKeyDown}
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-scara-gold dark:text-scara-gold">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 bg-transparent border border-wanderer-border dark:border-scara-primary rounded text-sm text-wanderer-text dark:text-white"
        />
        {previewUrl && (
          <Image src={previewUrl} alt="Preview" className="mt-2 max-h-40 rounded border border-gray-300" />
        )}
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-wanderer-accent dark:bg-scara-primary hover:bg-wanderer-hover dark:hover:bg-scara-accent text-white rounded font-elegant transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
