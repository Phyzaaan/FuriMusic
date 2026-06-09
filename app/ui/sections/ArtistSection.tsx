'use client';
import ArtistCard from "../components/ArtistCard";
import TitleBar from "../components/Title";
import { useRef } from "react";
import ErrorMsg from "../components/Error";

type artistProps = {
  Artists: {
    id: number;
    name: string;
    banner: string;
  }[] | undefined;
  link?: string
};

function ArtistsSection({ Artists, link }: artistProps) {
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
        link={link}
      >Artists</TitleBar>
      {<div ref={scrollContainerRef}
        className="no-scrollbar flex shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1">
        {Artists && Artists.length > 0  ? (Artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              id={artist.id}
              banner={artist.banner}
              name={artist.name}
            />
          )
          )) : (
        <ErrorMsg>There is NOTING!</ErrorMsg>
      )
        }
      </div>}
    </>
  );
}

export default ArtistsSection;
