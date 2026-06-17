"use client";
import SongsCard from "@/app/ui/components/Songcard";
import Image from "next/image";
import { SecondaryBtn, PrimaryBtn } from "@/app/ui/components/Buttons";
import { Playlist, Song } from "@/app/utils/data/type";
import useMusic from "@/app/musicProvider";
import { useState } from "react";
import { loadSong } from "@/app/utils/libs/playSong";
import PlaylistEditor from "@/app/playlists/sections/editor";

export default function PlaylistPage({ Playlist, Songs, }: { Playlist: Playlist; Songs: Song[]; }) {
  const { setQueue, setCurrTrack, isAdmin } = useMusic();
  const [showEditor, setshowEditor] = useState(false);

  const handlePlayAll = () => {
    if (!Songs?.length) return;
    setQueue(Songs);
    const first = Songs[0];
    setCurrTrack(first);
    loadSong(first, true);
  };
  return (
    <>
      <div className="flex items-center justify-between w-full gap-4 px-4 py-2">
        <div className="h-full shrink-0 rounded-md aspect-square overflow-hidden">
        <Image
          src={Playlist.banner}
          alt={Playlist.name}
          width={180}
          height={180}
          className="object-cover"
        />
        </div>

        <div className="py-4 h-full w-full flex flex-col gap-4 items-start overflow-hidden">
          <div>
            <h2 className="w-full text-xl font-semibold truncate">{Playlist.name}</h2>
            <p className="text-md text-secondary">
              {Playlist.totalSongs} {Playlist.totalSongs === 1 ? "song" : "songs"}
            </p>
          </div>
            <SecondaryBtn onClick={handlePlayAll}>Play All</SecondaryBtn>
        </div>
        <div className="h-full py-2 shrink-0">
          {isAdmin && <PrimaryBtn onClick={() => setshowEditor(true)} icon="/icons/edit.svg" width={24} height={24} />}
        </div>
      </div>
      <div className="no-scrollbar flex w-full flex-col gap-2 px-6 py-4 pb-22 overflow-y-auto">
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

      <PlaylistEditor playlist={Playlist} showEditor={showEditor} setShowEditor={setshowEditor}/>
    </>
  );
}
