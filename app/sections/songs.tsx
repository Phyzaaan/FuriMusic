'use client';
import Songs from "../data/songs";
import TitleBar from "../components/title";
import SongsCard from "../components/songcard";
import { useRef } from "react";

type songsProps = {
  songs: string[];
}
function SongsSection({ songs }: songsProps) {
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
      link="/songs"
      handleScroll={handleScroll}
      >Songs</TitleBar>
      <div ref={scrollContainerRef}
      className="no-scrollbar flex min-h-74 w-full max-w-[calc(100%-16px)] snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-2 mx-auto">
        {songs.reduce<string[][]>((chunks, songId, index) => {
          const chunkIndex = Math.floor(index / 4);
          if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
          chunks[chunkIndex].push(songId);
          return chunks;
        }, []).map((columnGroup, columnIndex) => (
          <div
            key={columnIndex}
            className="flex h-full w-[90%] min-w-[95%] snap-start flex-col gap-3 md:w-100 md:min-w-100"
          >
            {columnGroup.map((songId) => {
              const song = Songs.find((song) => song.id === songId);
              if (!song) return null;

              return (
                <SongsCard
                  key={song.id}
                  songId={song.id}
                  songName={song.name}
                  artistName={song.artist}
                  duration={song.duration}
                  songImage={`/SongsBanner/${song.banner}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default SongsSection;
