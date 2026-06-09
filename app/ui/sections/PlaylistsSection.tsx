'use client';
import { useRef } from "react";
import PlaylistCard from "../components/PlaylistCard";
import TitleBar from "../components/Title";
import ErrorMsg from "../components/Error";

type playlistProps = {
  Playlists: {
    id: number;
    name: string;
    banner: string;
    totalSongs: number;
  }[] | undefined;
  link?: string;
};

export function PlaylistsSection({ Playlists, link }: playlistProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleScroll(left: boolean) {
    scrollContainerRef.current?.scrollBy({
      left: left ? -150 : 150,
      behavior: "smooth",
    });
  }
  return (
    <>
      <TitleBar link={link} handleScroll={handleScroll}>
        Playlists
      </TitleBar>
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1"
      >{Playlists && Playlists.length > 0  ? (Playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          id={playlist.id}
          banner={playlist.banner}
          name={playlist.name}
          totalSongs={playlist.totalSongs}
        />
      ))
      ) : (
       <ErrorMsg>There is NOTING!</ErrorMsg>
      )
        }
      </div>
    </>
  );
}

