import api from "@/utils/api";
import { Post } from "@/types/post";

// GET all posts
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await api.get("/api/posts");
  return response.data;
};

// GET single post by ID
export const fetchPostById = async (id: number): Promise<Post> => {
  const response = await api.get(`/api/posts/${id}`);
  return response.data;
};

// CREATE post
export const createPost = async (post: Partial<Post>) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const person_id = user.id;

  return await api.post("/api/posts", {
    ...post,
    person_id, // ✅ attach personal_id to the payload
  });
};

// UPDATE post
export const updatePost = async (id: number, post: Partial<Post>) => {
  return await api.put(`/api/posts/${id}`, post);
};

// DELETE post
export const deletePost = async (id: number) => {
  return await api.delete(`/api/posts/${id}`);
};
