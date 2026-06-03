'use client';
import { useRef } from "react";
import PlaylistCard from "../components/playlistCard";
import TitleBar from "../components/title";

type playlistProps = {
  Playlists: {
    id: number;
    name: string;
    banner: string;
    songs: number[];
  }[];
};

export function PlaylistsSection({ Playlists }: playlistProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleScroll(left: boolean) {
    scrollContainerRef.current?.scrollBy({
      left: left ? -150 : 150,
      behavior: "smooth",
    });
  }
  return (
    <>
      <TitleBar link="/playlists" handleScroll={handleScroll}>
        Playlists
      </TitleBar>
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex min-h-52 shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1"
      >
        {Playlists.map((playlist) => {
          return (
            <PlaylistCard
              key={playlist.id}
              banner={playlist.banner}
              name={playlist.name}
              tracks={playlist.songs.length}
            />
          );
        })}
      </div>
    </>
  );
}

