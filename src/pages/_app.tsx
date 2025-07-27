import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") setDarkMode(true);
    if (saved === "dark") setDarkMode(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Layout darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}
