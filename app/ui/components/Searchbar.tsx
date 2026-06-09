'use client';
import { PrimaryBtn } from "./Buttons";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from "react";

type props = {
  showSearchbar: boolean,
}

function Searchbar({ showSearchbar }: props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('query')?.toString() || "");

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`bg-card-bg absolute ${showSearchbar ? "top-0" : "-top-full"} flex h-full w-full items-center justify-center transition-all duration-150`}>
      <form onSubmit={handleSubmit}
        className="bg-dark-bg border-card-border flex w-3/4 items-center justify-between rounded-md border">
        <PrimaryBtn
          type="submit"
          icon={`/icons/search.svg`}
          width={24}
          height={24}
          className="pl-2"
        />
        <input
          type="search"
          placeholder="Search song, artist, playlist..."
          className="w-full px-2 py-1 text-lg outline-none"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </form>
    </div>
  )
}

export default Searchbar;