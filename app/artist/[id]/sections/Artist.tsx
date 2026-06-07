"use client";
import SongsCard from "@/app/ui/components/Songcard";
import Image from "next/image";
import { SecondaryBtn } from "@/app/ui/components/Buttons";
import { Artist, Song } from "@/app/utils/data/type";
import useMusic from "@/app/musicProvider";
import { loadSong } from "@/app/utils/libs/playSong";

interface ArtistProp extends Artist {
  totalSongs: number;
}

export function ArtistInfo({
  Artist,
  Songs,
}: {
  Artist: ArtistProp;
  Songs: Song[];
}) {
  const { setQueue, setCurrTrack } = useMusic();

  const handlePlayAll = () => {
    if (!Songs?.length) return;
    setQueue(Songs);
    const first = Songs[0];

    // Keep UI/queue in sync with SongsCard click behavior
    setCurrTrack(first);
    loadSong(first, true);
  };

  return (
    <div className="no-scrollbar flex items-center w-full gap-4 px-4 py-2">
      <Image
        src={Artist.banner}
        alt={Artist.name}
        width={180}
        height={180}
        className="object-cover rounded-full"
      />
      <div className="py-6 w-full flex flex-col gap-6 items-start justify-center">
        <div>
          <h2 className="text-xl font-semibold truncate">{Artist.name}</h2>
          <p className="text-md text-secondary mb-24">
            {Artist.totalSongs} {Artist.totalSongs === 1 ? "song" : "songs"}
          </p>
        </div>
        <SecondaryBtn onClick={handlePlayAll}>Play All</SecondaryBtn>
      </div>
    </div>
  );
}

export function ArtistBody({ Songs }: { Songs: Song[] }) {
  return (
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
  );
}

