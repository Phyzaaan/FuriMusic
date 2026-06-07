"use client";
import TitleBar from "../components/Title";
import SongsCard from "../components/Songcard";
import { useRef } from "react";
import type { Song } from "../../utils/data/type";
import { loadSong } from "@/app/utils/libs/playSong";
import useMusic from "@/app/musicProvider";

type SongsSectionProps = {
  Songs: Song[];
};

function SongsSection({ Songs }: SongsSectionProps) {
  const { setQueue, setCurrTrack } = useMusic();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleScroll(left: boolean) {
    scrollContainerRef.current?.scrollBy({
      left: left ? -150 : 150,
      behavior: "smooth",
    });
  }
  const handlePlayAll = () => {
    if (!Songs?.length) return;
    setQueue(Songs);
    const first = Songs[0];
    setCurrTrack(first);
    loadSong(first, true);
  };
  return (
    <>
      <TitleBar link="/songs" handleScroll={handleScroll} handleQueue={handlePlayAll}>
        Songs
      </TitleBar>
      <div
        ref={scrollContainerRef}
        className="no-scrollbar mx-auto flex shrink-0 w-full max-w-[calc(100%-16px)] snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-2"
      >{Songs.length > 0 ? (Songs.reduce<Song[][]>((chunks, song, index) => {
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
            {columnGroup.map((song) => (
              <SongsCard
                key={song.id}
                id={song.id}
                name={song.name}
                artists={song.artists}
                duration={song.duration}
                banner={song.banner}
                url={song.url}
              />
            ))}
          </div>
        ))) : (
        <h1 className="w-full text-center mx-auto my-auto">There is Nothing</h1>
      )
        }
      </div>
    </>
  );
}

export default SongsSection;