import { useState, useEffect, useRef } from "react";
import typesense from "@/utils/typesenseClient";
import SearchDropdown from "@/components/shared/SearchDropdown";
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents';


// Define supported content types
const CONTENT_TYPES = ["posts", "blogs", "events", "people"] as const;
type CollectionType = (typeof CONTENT_TYPES)[number];

// Define a generic search document shape
type BaseDocument = {
  id: string;
  title?: string;
  body?: string;
  name?: string;
  email?: string;
  bio?: string;
  location?: string;
};

// Define a result type with collection info
type SearchResult = BaseDocument & {
  _type: CollectionType;
};

export default function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        const allResults: SearchResult[] = [];

        await Promise.all(
          CONTENT_TYPES.map(async (collection) => {
            try {
              const queryByMap: Record<CollectionType, string> = {
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
                  query_by: queryByMap[collection],
                  per_page: 3,
                });

              const docs = res.hits?.map((hit: SearchResponseHit<object>) => {
                const doc = hit.document as BaseDocument; // ✅ safe cast here
                return {
                  ...doc,
                  _type: collection,
                };
              }) || []; 

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
