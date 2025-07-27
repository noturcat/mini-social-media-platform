import { useState, useEffect } from "react";
import typesense from "@/utils/typesenseClient";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";

interface SearchResultDocument {
  id: string;
  title?: string;
  body?: string;
  [key: string]: unknown;
}

interface SearchBarProps {
  collection: string;
  onResults: (results: SearchResultDocument[]) => void;
  placeholder?: string;
}

export default function SearchBar({
  collection,
  onResults,
  placeholder = "Search...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        onResults([]);
        return;
      }

      try {
        const searchResults = await typesense
          .collections(collection)
          .documents()
          .search({
            q: query,
            query_by: "title,body",
            per_page: 10,
          });

        const hits = searchResults.hits as SearchResponseHit<SearchResultDocument>[];
        const documents = hits.map((hit) => hit.document);

        onResults(documents);
      } catch (error) {
        console.error("Typesense search error:", error);
        onResults([]);
      }
    };

    const delayDebounce = setTimeout(search, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, collection, onResults]);

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 px-4 rounded border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg text-wanderer-text dark:text-white placeholder-wanderer-accent dark:placeholder-scara-accent shadow transition-all"
      />
    </div>
  );
}
