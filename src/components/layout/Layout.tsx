import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Layout({ children, darkMode, toggleDarkMode }: LayoutProps) {
  return (
    <div className="min-h-screen bg-wanderer-bg dark:bg-scara-bg text-wanderer-text dark:text-white transition-colors duration-300 font-thin">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="max-w-5xl mx-auto p-4">{children}</main> 
    </div>
  );
}
