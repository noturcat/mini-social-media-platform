import api from "@/utils/api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/login", { email, password });

    const data = response.data;

    if (!data || !data.token || !data.user) {
      throw new Error("Invalid login response");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data.user;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      console.error("Login failed:", (error as any).response.data); // fallback if no better type is available
    } else {
      console.error("Login failed:", error);
    }
    throw new Error("Invalid login response");
  }
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