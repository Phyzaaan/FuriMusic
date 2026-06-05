"use client";
import PlaylistCard from "@/app/ui/components/playlistCard";
import { useEffect, useRef, useState } from "react";
import { Playlist } from "@/app/utils/data/type";
import { loadMorePlaylists } from "@/app/utils/data/clientData";

type Playlists = {
  Playlists: Playlist[];
};

function PlaylistsSection({ Playlists }: Playlists) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const [playlists, setPlaylists] = useState<Playlist[]>(Playlists);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(Playlists.length);
  const [hasMore, setHasMore] = useState<boolean>(Playlists.length === 8);


  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Intersecting:", entries[0].isIntersecting);
        if (!entries[0].isIntersecting) return;
        loadMorePlaylists({
          loading,
          setLoading,
          hasMore,
          setHasMore,
          offset,
          setOffset,
          setPlaylists,
        });
      },
      { threshold: 2 }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasMore, offset, loading]);


  return (
    <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
      {playlists.map(({ id, banner, name, totalSongs }) => {
        return (
          <PlaylistCard
            key={id}
            id={id}
            banner={banner}
            name={name}
            totalSongs={totalSongs}
          />
        );
      })}
      {hasMore && (
        <div ref={observerTarget} className="flex w-full col-span-full items-center justify-center p-4">
          {loading && (
            <div className="animate-pulse text-secondary">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlaylistsSection;
