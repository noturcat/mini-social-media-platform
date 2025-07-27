import { useEffect, useState } from "react"; 
import { Post } from "@/types/post";
import ComposePostBar from "@/components/posts/ComposePostBar";
import FloatingCreateButton from "@/components/shared/FloatingCreateButton";
import PostModal from "@/components/posts/PostModal";
import PostCard from "@/components/posts/PostCard";
import { themedSwal } from "@/utils/swal";
import { successSwal, errorSwal, confirmSwal, editPostSwal } from "@/utils/swal";

// api
import { fetchPosts, deletePost } from "@/api/posts";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
  const load = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      // Optionally show a user-friendly error modal
      themedSwal.fire({
        icon: "error",
        title: "Oops!",
        text: "Unable to load posts. Please try again later.",
      });
    }
  };
  load();
}, []);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to reload posts:", err);
      errorSwal("Could not reload posts.");
    }
  };

  
  const handleDelete = async (id: number) => {
    const result = await confirmSwal("This post will be permanently deleted.");

    if (result.isConfirmed) {
      try {
        await deletePost(id);
        successSwal("Post deleted.");
        loadPosts(); // refresh
      } catch (err) {
        errorSwal("Failed to delete post.");
        if (err instanceof Error) {
          console.error(err.message);
        }
      }
    }
  };
  const handleEdit = async (post: Post) => {
    await editPostSwal(post, loadPosts); // 🔁 reload after editing
  };

  return (
    <main className="max-w-3xl mx-auto p-4 font-thin text-white">
      <ComposePostBar onPostCreated={loadPosts}/>

      <h1 className="text-2xl font-elegant text-scara-gold mb-4">Feed</h1>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} onEdit={() => handleEdit(post)} onDelete={() => handleDelete(post.id)}/>
      ))}

      {/* Mobile view */}
      <FloatingCreateButton onClick={() => setIsOpen(true)} />
      <PostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  );
}