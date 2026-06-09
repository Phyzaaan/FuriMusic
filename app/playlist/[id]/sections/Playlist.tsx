"use client";
import SongsCard from "@/app/ui/components/Songcard";
import Image from "next/image";
import { SecondaryBtn } from "@/app/ui/components/Buttons";
import { Playlist, Song } from "@/app/utils/data/type";
import useMusic from "@/app/musicProvider";
import { loadSong } from "@/app/utils/libs/playSong";

export default function PlaylistPage({ Playlist, Songs, }: { Playlist: Playlist; Songs: Song[]; }) {
  const { setQueue, setCurrTrack } = useMusic();

  const handlePlayAll = () => {
    if (!Songs?.length) return;
    setQueue(Songs);
    const first = Songs[0];
    setCurrTrack(first);
    loadSong(first, true);
  };
  return (
    <>
      <div className="no-scrollbar flex items-center w-full gap-4 px-4 py-2">
        <Image
          src={Playlist.banner}
          alt={Playlist.name}
          width={180}
          height={180}
          className="object-cover rounded-md"
        />
        <div className="py-4 h-full w-full flex flex-col gap-4 items-start">
          <div>
            <h2 className="text-xl font-semibold truncate">{Playlist.name}</h2>
            <p className="text-md text-secondary">
              {Playlist.totalSongs} {Playlist.totalSongs === 1 ? "song" : "songs"}
            </p>
          </div>
          <SecondaryBtn onClick={handlePlayAll}>Play All</SecondaryBtn>
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
    </>
  );
}
