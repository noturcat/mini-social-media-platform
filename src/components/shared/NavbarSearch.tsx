import { useState, useEffect, useRef } from "react";
import typesense from "@/utils/typesenseClient";
import SearchDropdown from "@/components/shared/SearchDropdown"; 

const CONTENT_TYPES = ["posts", "blogs", "events", "people"];

export default function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const allResults: string[] = [];

        await Promise.all(
          CONTENT_TYPES.map(async (collection) => {
            try {
              const queryByMap: Record<string, string> = {
                posts: "title,body",
                blogs: "title,body",
                events: "title,location",
                people: "name,email,bio",
              };

              const res = await typesense
                .collections(collection)
                .documents()
                .search({
                  q: query,
                  query_by: queryByMap[collection] || "title",
                  per_page: 3,
                });

              const docs = res.hits?.map((hit: any) => ({
                ...hit.document,
                _type: collection, // Add type for routing/identification
              })) || [];

              allResults.push(...docs);
            } catch (err) {
              console.error(`Failed search in ${collection}:`, err);
            }
          })
        );

        setResults(allResults);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      }
    };

    const delay = setTimeout(search, 300);
    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Explore anything..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 px-4 rounded border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg text-sm text-wanderer-text dark:text-white placeholder-wanderer-accent dark:placeholder-scara-accent transition"
      />

      {showDropdown && results.length > 0 && (
        <SearchDropdown
          results={results}
          onClose={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
