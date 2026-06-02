'use client';
import ArtistCard from "../components/artistCard";
import TitleBar from "../components/title";
import { useRef } from "react";

type artistProps = {
  artists: {
    id: number;
    name: string;
    banner: string;
  }[];
};

function ArtistsSection({ artists }: artistProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleScroll(left: boolean) {
    scrollContainerRef.current?.scrollBy({
      left: left ? -150 : 150,
      behavior: "smooth",
    });
  }
  return (
    <>
      <TitleBar
        handleScroll={handleScroll}
        link="/artists"
      >Artists</TitleBar>
      <div ref={scrollContainerRef}
        className="no-scrollbar flex shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1">
        {artists.map((artist) => {
          return (
            <ArtistCard
              key={artist.id}
              banner={artist.banner}
              name={artist.name}
            />
          );
        })}
      </div>
    </>
  );
}

export default ArtistsSection;
