import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchAllContent } from "@/utils/searchAllContent";
import typesense from "@/utils/typesenseClient";
import Link from "next/link";
import Image from "next/image";
import { BaseItem } from "@/types/content";

const CONTENT_TYPES = ["posts", "blogs", "events", "people"] as const;



const fetchAvailableTags = async (): Promise<string[]> => {
  try {
    const response = await typesense
      .collections("posts")
      .documents()
      .search({
        q: "*",
        facet_by: "tags",
        per_page: 0,
      });

    const facetCounts = response.facet_counts as {
      field_name: string;
      counts: { value: string; count: number }[];
    }[];

    const tagFacet = facetCounts?.find(f => f.field_name === "tags");

    return tagFacet?.counts.map(f => f.value) || [];
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
};

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState<Record<string, BaseItem[]>>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    fetchAvailableTags().then(setAvailableTags);
  }, []);

  const fetchSearch = useCallback(async () => {
    const collections: string[] =
  activeTab === "all" ? CONTENT_TYPES.slice() : [activeTab];
    
    const data = await searchAllContent(debounced, collections, selectedTags);
    setResults(data.grouped as Record<string, BaseItem[]>);
  }, [debounced, activeTab, selectedTags]);

  useEffect(() => {
    if (debounced.trim()) {
      fetchSearch(); // ← used here
    } else {
      setResults({});
    }
  }, [debounced, activeTab, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 font-thin text-wanderer-text dark:text-white transition-colors duration-300">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search posts, blogs, events, people..."
        className="w-full p-3 rounded border border-wanderer-border dark:border-scara-primary bg-wanderer-card dark:bg-scara-bg placeholder-wanderer-accent dark:placeholder-scara-accent text-wanderer-text dark:text-white shadow"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Content Type Tabs */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {["all", ...CONTENT_TYPES].map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-1 rounded-full text-sm border font-medium transition-colors ${
              activeTab === type
                ? "bg-scara-gold text-white"
                : "bg-wanderer-card dark:bg-scara-bg text-wanderer-text dark:text-white border-wanderer-border dark:border-scara-primary"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Dynamic Tags */}
      {availableTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                selectedTags.includes(tag)
                  ? "bg-scara-accent text-white"
                  : "bg-wanderer-card dark:bg-scara-bg text-wanderer-text dark:text-white border-wanderer-border dark:border-scara-primary"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Results Grouped by Type */}
      <div className="mt-8 space-y-10">
        {Object.entries(results).map(([type, items]) => (
          <div key={type}>
            <h2 className="text-xl font-elegant text-scara-gold border-b border-scara-primary pb-2 capitalize mb-4">
              {type}
            </h2>
            {items.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No results</p>
            ) : (
              <ul className="space-y-6">
                {items.map(item => (
                  <li
                    key={item.id}
                    className="bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary text-wanderer-text dark:text-white p-4 rounded-lg shadow transition-colors duration-300 font-thin"
                  >
                    <h2 className="text-xl font-elegant text-scara-gold dark:text-scara-gold">
                      {item.title || item.name}
                    </h2>

                    <p className="mt-1 text-sm">
                      {item.body || item.bio || item.location || item.email}
                    </p>

                    {item.image_url && (
                      <div className="mt-3 flex justify-center">
                        <Image
                          src={item.image_url || "/uploads/tignari.png"}
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/uploads/tignari.png";
                          }}
                          alt="Preview"
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                    )} 
                    {(item.tags ?? []).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(item.tags ?? []).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded bg-wanderer-accent/10 dark:bg-scara-primary/20 text-wanderer-accent dark:text-scara-accent"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )} 
                    <div className="mt-4 flex gap-4 text-sm justify-end">
                      <Link href={`/${type}/${item.id}`}>
                        <button className="text-wanderer-primary dark:text-scara-card hover:underline">
                          View
                        </button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
