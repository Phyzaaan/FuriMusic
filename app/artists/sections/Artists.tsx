"use client";
import ArtistCard from "@/app/ui/components/ArtistCard";
import { useEffect, useRef, useState } from "react";
import { loadMoreArtists } from "@/app/utils/data/clientData";
import { Artist } from "@/app/utils/data/type";

type artistProps = {
  Artists: Artist[];
};

function ArtistsSection({ Artists }: artistProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const [artists, setArtists] = useState<Artist[]>(Artists);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(Artists.length);
  const [hasMore, setHasMore] = useState<boolean>(Artists.length === 8);


  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Intersecting:", entries[0].isIntersecting);
        if (!entries[0].isIntersecting) return;
        loadMoreArtists({
          loading,
          setLoading,
          hasMore,
          setHasMore,
          offset,
          setOffset,
          setArtists,
        });
      },
      { threshold: 1 }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasMore, offset, loading]);


  return (
    <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
      {artists.map(({ id, banner, name }: Artist) => {
        return (
          <ArtistCard
            key={id}
            id={id}
            banner={banner}
            name={name}
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

export default ArtistsSection;
