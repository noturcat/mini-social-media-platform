import { useState, useEffect } from "react";
import typesense from "@/utils/typesenseClient";

interface SearchBarProps {
  collection: string;
  onResults: (results: string[]) => void;
  placeholder?: string;
}

export default function SearchBar({ collection, onResults, placeholder = "Search..." }: SearchBarProps) {
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
            query_by: "title,body", // fields to search
            per_page: 10,
          });

        onResults(searchResults.hits?.map((hit: string) => hit.document) || []);
      } catch (error) {
        console.error("Typesense search error:", error);
        onResults([]);
      }
    };

    const delayDebounce = setTimeout(search, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

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
