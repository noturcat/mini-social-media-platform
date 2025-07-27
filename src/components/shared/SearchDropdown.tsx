import Link from "next/link";

interface ResultItem {
  id: number | string;
  _type: string; // posts, blogs, events, people
  title?: string;
  body?: string;
  summary?: string;
  location?: string;
  name?: string;
  email?: string;
}

interface Props {
  results: ResultItem[];
  onClose: () => void;
}

export default function SearchDropdown({ results, onClose }: Props) {
  return (
    <div className="absolute z-50 top-full left-0 w-full mt-1 overflow-y-auto max-h-64 rounded shadow-lg bg-wanderer-card dark:bg-scara-bg border border-wanderer-border dark:border-scara-primary scrollbar-thin scrollbar-thumb-wanderer-bg dark:scrollbar-thumb-scara-primary scrollbar-track-transparent">
      {results.map((item) => (
        <Link
          key={`${item._type}-${item.id}`}
          href={`/${item._type}/${item.id}`}
          onClick={onClose}
          className="block px-4 py-2 text-sm hover:bg-wanderer-hover/20 dark:hover:bg-scara-primary/20 transition"
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-scara-gold mb-1">
            {item._type}
          </div>
          <div className="font-medium text-wanderer-text dark:text-white truncate">
            {item.title || item.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {item.body || item.summary || item.location || item.email}
          </div>
        </Link>
      ))}
    </div>
  );
}
