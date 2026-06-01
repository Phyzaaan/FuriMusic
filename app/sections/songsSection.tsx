"use client";
import TitleBar from "../components/title";
import SongsCard from "../components/songcard";
import { useRef } from "react";
import type { Song } from "../data/type";
import useMusic from "../musicProvider";

type songsSectionProps = {
  songs: Song[];
};

function SongsSection({ songs }: songsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setQueue } = useMusic();

  function handleQueue() {
    setQueue(songs);
  }

  function handleScroll(left: boolean) {
    scrollContainerRef.current?.scrollBy({
      left: left ? -150 : 150,
      behavior: "smooth",
    });
  }
  return (
    <>
      <TitleBar link="/songs" handleScroll={handleScroll}>
        Songs
      </TitleBar>
      <div
        ref={scrollContainerRef}
        className="no-scrollbar mx-auto flex min-h-74 w-full max-w-[calc(100%-16px)] snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-2"
      >
        {songs
          .reduce<Song[][]>((chunks, song, index) => {
            const chunkIndex = Math.floor(index / 4);
            if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
            chunks[chunkIndex].push(song);
            return chunks;
          }, [])
          .map((columnGroup, columnIndex) => (
            <div
              key={columnIndex}
              className="flex h-full w-[90%] min-w-[95%] snap-start flex-col gap-3 md:w-100 md:min-w-100"
            >
              {columnGroup.map((song) => {
                return (
                  <SongsCard
                    key={song.id}
                    id={song.id}
                    name={song.name}
                    artists={song.artists}
                    duration={song.duration}
                    banner={song.banner}
                    url={song.url}
                    lyrics={song.lyrics}
                    handleQueue={handleQueue}
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

export function SongsDiv({ songs }: songsSectionProps) {
  const { setQueue } = useMusic();

  function handleQueue() {
    setQueue(songs);
  }

  return (
    <div className="no-scrollbar flex w-full flex-col gap-2 px-2 py-1">
      {songs.map((song) => {
        return (
          <SongsCard
            key={song.id}
            id={song.id}
            name={song.name}
            artists={song.artists}
            duration={song.duration}
            banner={song.banner}
            url={song.url}
            lyrics={song.lyrics}
            handleQueue={handleQueue}
          />
        );
      })}
    </div>
  );
}
