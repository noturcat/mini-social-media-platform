import { useState } from "react";
import { register } from "@/api/auth";
import { useRouter } from "next/router"; 
import { successSwal, errorSwal } from "@/utils/swal";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter(); 

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return errorSwal("All fields are required.");
    }

    try {
      await register(name, email, password);  
      await successSwal("Account created!");
      router.push("/");
    } catch (error: unknown) {
      errorSwal("Registration failed. Please try again.");
      if (typeof error === "object" && error !== null && "message" in error) {
        console.error((error as { message: string }).message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-wanderer-card dark:bg-scara-bg rounded border border-wanderer-border dark:border-scara-primary text-wanderer-text dark:text-white">
      <h1 className="text-xl font-elegant text-scara-gold mb-4">Create an Account</h1>

      <input
        type="text"
        placeholder="Name"
        className="w-full mb-3 p-2 border rounded bg-transparent placeholder-wanderer-accent dark:placeholder-scara-accent"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
        className="w-full mb-3 p-2 border rounded bg-transparent placeholder-wanderer-accent dark:placeholder-scara-accent"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-scara-primary text-white py-2 rounded font-elegant hover:bg-scara-accent transition"
      >
        Register
      </button>
    </div>
  );
}
