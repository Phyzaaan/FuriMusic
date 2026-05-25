"use client";
import Image from "next/image";
import { playSong, pauseSong, loadSong } from "../libs/playSong";
import useMusic from "../musicProvider";

type Props = {
  songId: string;
  songName: string;
  artistName: string;
  duration: string;
  songImage: string;
};

export default function SongsCard({
  songId,
  songName,
  artistName,
  duration,
  songImage,
}: Props) {
  const { currSongId, setCurrSongId, isPlaying } = useMusic();
  return (
    <li
      key={songId}
      onClick={() => {
        if (currSongId === songId) {
          if (isPlaying) {
            pauseSong();
          } else {
            playSong();
          }
        } else {
          setCurrSongId(songId);
          loadSong(songId, setCurrSongId, true);
        }
      }}
      className={`group w-full max-h-15 min-w-0 flex-1 cursor-pointer border ${isPlaying && currSongId == songId ? "border-card-border bg-card-bg border shadow-lg" : "border-transparent"} hover:border-card-border flex items-center justify-between gap-3 rounded-md px-2 py-1.5`}
    >
      <div className="relative flex h-12 w-14 items-center justify-center rounded-md">
        <Image
          src={songImage}
          alt="Favorite"
          fill
          sizes="60"
          className="object-cover"
        />
        <div className="bg-card-bg absolute h-full w-full opacity-0 transition-all duration-200 group-hover:opacity-50"></div>
        <Image
          src={`/icons/${isPlaying && currSongId == songId ? "pause" : "play_arrow"}.svg`}
          alt="Play button"
          width="42"
          height="42"
          className="invisible scale-70 transform transition-all duration-200 group-hover:visible group-hover:scale-100"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
        <h3 className="text-primary w-full truncate text-[16px] font-medium">
          {songName}
        </h3>
        <p className="text-secondary w-full truncate text-[14px]">
          {artistName}
        </p>
      </div>
      <div>
        <span className="text-secondary text-[16px]">
          {isPlaying && currSongId == songId ? "Playing" : duration}
        </span>
      </div>
    </li>
  );
}
