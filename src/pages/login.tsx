import { useState } from "react"; 
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { successSwal, errorSwal } from "@/utils/swal";
import { useEffect } from "react";
import { login } from "@/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  const router = useRouter();
  const { user } = useAuth();

const handleLogin = async () => {
  try {
    const user = await login(email, password); // ⬅️ this stores token + user
    const token = localStorage.getItem("access_token");

    if (!user || !token) {
      throw new Error("Invalid login response");
    }

    loginUser(user, token); // ⬅️ set React context/state
    await successSwal("Logged in successfully!");
    router.replace("/");
    router.reload();
  } catch (err) {
    await errorSwal("Login failed. Please check your credentials.");
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};


  useEffect(() => {
    if (user) {
      router.replace("/"); // home route
    }
  }, [user]);


  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-wanderer-card dark:bg-scara-bg rounded border dark:border-scara-primary">
      <h1 className="text-xl font-elegant text-scara-gold mb-4">Login</h1>
      
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-2 border rounded bg-transparent placeholder-wanderer-accent dark:placeholder-scara-accent"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded bg-transparent"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button
        onClick={handleLogin}
        className="w-full bg-scara-primary text-white py-2 rounded font-elegant"
      >
        Login
      </button>
    </div>
  );
}
