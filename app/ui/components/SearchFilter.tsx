"use client";

import { useRouter } from "next/navigation";

export function SearchFilters({ currentType, query }: { currentType: string; query: string }) {
  const router = useRouter();
  const filters = ["all", "songs", "playlists", "artists"];

  const handleFilterClick = (type: string) => {
    // Keep the search query if it exists while updating the type
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (type !== "all") params.set("type", type);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="shrink-0 flex gap-2 p-4 overflow-x-auto overflow-y-hidden">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`px-4 py-1.5 rounded-lg capitalize text-sm font-medium transition border border-transparent ${
            currentType === filter
              ? "bg-card-bg text-blue-600 border-card-border"
              : "hover:border-card-border"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}