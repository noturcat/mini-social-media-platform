import api from "@/utils/api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/login", { email, password });

  const { token, user } = response.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
};

export const register = async (
  name: string,
  email: string,
  password: string,
  password_confirmation?: string
) => {
  const response = await api.post("/api/register", {
    name,
    email,
    password,
    password_confirmation: password_confirmation ?? password,
  });

  const { token, user } = response.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export const getUser = async () => {
  const res = await api.get("/api/user");
  return res.data;
};