import Link from "next/link";
import { useRouter } from "next/router";
import NavbarSearch from "@/components/shared/NavbarSearch"; 
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/api/auth"; 

export default function Navbar({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const links = [
    { label: "Posts", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: "Events", href: "/events" },
    { label: "Search", href: "/search" },
  ];

  const handleLogout = async () => {
    await logout();      // ✅ clear token and user
    setUser(null);       // ✅ update React state
    router.push("/login"); // ✅ redirect
  };

  return (
    <nav className="sticky top-0 z-50 bg-wanderer-bg dark:bg-scara-bg text-wanderer-text dark:text-scara-gold border-b border-wanderer-border dark:border-scara-primary shadow transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Nav links */}
        <div className="flex space-x-6">
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

        {/* Right side: search + auth + dark mode */}
        <div className="flex items-center gap-4">
          {/* Search (desktop only) */}
          <div className="hidden md:block">
            <NavbarSearch />
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-sm px-4 py-1 rounded font-thin text-white bg-wanderer-accent dark:bg-scara-primary hover:bg-wanderer-hover dark:hover:bg-scara-accent transition"
          >
            {darkMode ? "🌙 Dark" : "☀ Light"}
          </button>

          {/* Auth buttons */}
          {user ? (
            <>
              <span className="text-sm text-wanderer-text dark:text-white font-thin hidden md:inline">
                <Link href={`/people/${user.id}`}>
                  👤 {user.name}
                </Link>
              </span>
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
    </nav>
  );
}

