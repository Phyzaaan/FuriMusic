"use client";
import SongsCard from "@/app/ui/components/Songcard";
import Image from "next/image";
import { PrimaryBtn, SecondaryBtn } from "@/app/ui/components/Buttons";
import { Artist, Song } from "@/app/utils/data/type";
import useMusic from "@/app/musicProvider";
import { loadSong } from "@/app/utils/libs/playSong";
import ArtistEditor from "./editor";
import { useState } from "react";

interface ArtistProp extends Artist {
  totalSongs: number;
}
export default function ArtistPage({ Artist, Songs, }: { Artist: ArtistProp; Songs: Song[]; }) {
  const { setQueue, setCurrTrack, isAdmin } = useMusic();

  const [showEditor, setShowEditor] = useState(false);

  const handlePlayAll = () => {
    if (!Songs?.length) return;
    setQueue(Songs);
    const first = Songs[0];

    // Keep UI/queue in sync with SongsCard click behavior
    setCurrTrack(first);
    loadSong(first, true);
  };

  return (
    <>
      <div className="no-scrollbar flex items-center w-full gap-4 px-4 py-2">
        <div className="h-full shrink-0 aspect-square rounded-full overflow-hidden">
          <Image
            src={Artist.banner}
            alt={Artist.name}
            width={180}
            height={180}
            className="object-cover "
          />
        </div>
        <div className="py-6 w-full flex flex-col gap-6 items-start justify-center">
          <div>
            <h2 className="text-xl font-semibold truncate">{Artist.name}</h2>
            <p className="text-md text-secondary mb-24">
              {Artist.totalSongs} {Artist.totalSongs === 1 ? "song" : "songs"}
            </p>
          </div>
          <SecondaryBtn onClick={handlePlayAll}>Play All</SecondaryBtn>
        </div>

        <div className="h-full py-2 shrink-0">
          {isAdmin && <PrimaryBtn onClick={() => setShowEditor(true)} icon="/icons/edit.svg" width={24} height={24} />}
        </div>
      </div>
      <div className="no-scrollbar flex w-full flex-col gap-2 px-6 py-4 overflow-y-auto">
        {Songs.map((song) => {
          return (
            <SongsCard
              key={song.id}
              id={song.id}
              name={song.name}
              artists={song.artists}
              duration={song.duration}
              banner={song.banner}
              url={song.url}
            />
          );
        })}
      </div>
      <ArtistEditor artist={Artist} showEditor={showEditor} setShowEditor={setShowEditor} />
    </>
  );
}