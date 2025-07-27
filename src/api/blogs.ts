import api from "@/utils/api";
import { Blog } from "@/types/blog";

// Fetch all blogs
export const fetchBlogs = async (): Promise<Blog[]> => {
  const response = await api.get("/api/blogs");
  return response.data;
};

// Fetch blog by ID
export const fetchBlogById = async (id: number): Promise<Blog> => {
  const response = await api.get(`/api/blogs/${id}`);
  return response.data;
};

// Create blog
export const createBlog = async (blog: Partial<Blog>) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const person_id = user.id;

  return await api.post("/api/blogs", {
    ...blog,
    person_id, // ✅ attach personal_id to the payload
  });
};

// Update blog
export const updateBlog = async (id: number, blog: Partial<Blog>) => {
  return await api.put(`/api/blogs/${id}`, blog);
};

// Delete blog
export const deleteBlog = async (id: number) => {
  return await api.delete(`/api/blogs/${id}`);
};
