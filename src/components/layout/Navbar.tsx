import Link from "next/link";
import { useRouter } from "next/router";
import NavbarSearch from "@/components/shared/NavbarSearch";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/api/auth";
import { useState } from "react";

export default function Navbar({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Posts", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: "Events", href: "/events" },
    { label: "Search", href: "/search" },
  ];

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-wanderer-bg dark:bg-scara-bg text-wanderer-text dark:text-scara-gold border-b border-wanderer-border dark:border-scara-primary shadow transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Brand or menu toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-xl"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
          <span className="text-lg font-semibold hidden md:block">MySite</span>
        </div>

        {/* Nav links (desktop) */}
        <div className="hidden md:flex space-x-6">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`font-thin text-sm transition hover:text-wanderer-accent dark:hover:text-scara-accent ${
                router.pathname === href
                  ? "text-wanderer-accent dark:text-scara-accent font-semibold"
                  : "text-wanderer-text dark:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search (desktop only) */}
          <div className="hidden md:block">
            <NavbarSearch />
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-sm px-3 py-1 rounded font-thin text-white bg-wanderer-accent dark:bg-scara-primary hover:bg-wanderer-hover dark:hover:bg-scara-accent transition"
          >
            {darkMode ? "🌙 Dark" : "☀ Light"}
          </button>

          {/* Auth buttons (desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href={`/people/${user.id}`} className="text-sm font-thin">
                  👤 {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-thin"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm hover:text-wanderer-accent dark:hover:text-scara-accent"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm hover:text-wanderer-accent dark:hover:text-scara-accent"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-wanderer-bg dark:bg-scara-bg px-4 pb-4 space-y-2">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`block text-sm font-thin py-1 border-b dark:border-scara-primary ${
                router.pathname === href
                  ? "text-wanderer-accent dark:text-scara-accent font-semibold"
                  : "text-wanderer-text dark:text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 mt-3">
            {user ? (
              <>
                <Link
                  href={`/people/${user.id}`}
                  className="text-sm font-thin"
                  onClick={() => setMenuOpen(false)}
                >
                  👤 {user.name}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-thin"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
