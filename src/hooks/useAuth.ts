import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  const fetchUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user"); // Clean up bad data
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  const loginUser = (userData: any, token: string) => {
    if (userData && token) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", token);
      setUser(userData);
    } else {
      console.warn("Missing user or token on login");
    }
  };


  const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    setUser,
    loading,
    refresh: fetchUser,
    isLoggedIn: !!user,
    loginUser,
    logoutUser,
  };
}
