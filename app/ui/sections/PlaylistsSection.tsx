'use client';
import { useRef } from "react";
import PlaylistCard from "../components/PlaylistCard";
import TitleBar from "../components/Title";

type playlistProps = {
  Playlists: {
    id: number;
    name: string;
    banner: string;
    totalSongs: number;
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
        className="no-scrollbar flex shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1"
      >{Playlists.length > 0 ? (Playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          id={playlist.id}
          banner={playlist.banner}
          name={playlist.name}
          totalSongs={playlist.totalSongs}
        />
      ))
      ) : (
        <h1 className="w-full text-center mx-auto my-auto">There is Nothing</h1>
      )
        }
      </div>
    </>
  );
}

