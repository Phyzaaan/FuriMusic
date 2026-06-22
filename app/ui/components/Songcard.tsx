"use client";
import Image from "next/image";
import { playSong, pauseSong, loadSong } from "../../utils/libs/playSong";
import useMusic from "../../musicProvider";
import formatArtists from "@/app/utils/libs/formatArtists";
import { Song } from "../../utils/data/type";
import { SecondaryBtn } from "./Buttons";

interface songProps extends Song {
  onClick?: (value: number) => void;
}

export default function SongsCard({
  id,
  name,
  artists,
  duration,
  banner,
  url,
  onClick,
}: songProps) {
  const { currTrack, setCurrTrack, isPlaying, setQueue, queue } = useMusic();
  const currSong = {
    id: id,
    name: name,
    artists: artists,
    duration: duration,
    banner: banner,
    url: url
  }
  return (
    <li
      key={id}
      onClick={() => {
        if (currTrack?.id === id) {
          if (isPlaying) {
            pauseSong();
          } else {
            playSong();
          }
        } else {
          if (!queue.find(song => song.id === id)) {
            setQueue([...queue, currSong])
          }
          setCurrTrack(currSong);
          loadSong(currSong, true);
        }
      }}
      className={`group w-full max-h-15 min-w-0 flex-1 cursor-pointer border ${isPlaying && currTrack?.id == id ? "border-card-border bg-card-bg border shadow-lg" : "border-transparent"} hover:border-card-border flex items-center justify-between gap-3 rounded-md px-2 py-1.5`}
    >
      <div className="relative flex h-12 w-14 items-center justify-center rounded-sm overflow-hidden">
        <Image
          src={banner}
          alt="Favorite"
          fill
          sizes="60"
          className="object-cover"
        />
        <div className="bg-card-bg absolute h-full w-full opacity-0 transition-all duration-200 group-hover:opacity-50"></div>
        <Image
          src={`/icons/${isPlaying && currTrack?.id == id ? "pause" : "play_arrow"}.svg`}
          alt="Play button"
          width="42"
          height="42"
          className="invisible scale-70 transform transition-all duration-200 group-hover:visible group-hover:scale-100"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
        <h3 className="text-primary w-full truncate text-[16px] font-medium">
          {name}
        </h3>
        <p className="text-secondary w-full truncate text-[14px]">
          {formatArtists(artists.map(artist => artist.name))}
        </p>
      </div>
      {onClick ? <SecondaryBtn onClick={() => onClick(id)} icon="/icons/edit.svg" /> : <span className="text-secondary text-[16px]">
        {isPlaying && currTrack?.id == id ? "Playing" : duration}
      </span>}
    </li>
  );
}
