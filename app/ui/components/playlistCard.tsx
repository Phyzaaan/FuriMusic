import Image from "next/image";
import Link from "next/link";
import { Playlist } from "@/app/utils/data/type";

function PlaylistCard({ name, banner, totalSongs, id }: Playlist) {
  return (
    <div className="group hover:border-card-border w-48 flex flex-col shrink-0 snap-start items-center justify-center gap-2 rounded-lg border border-transparent p-2">
      <div className="relative w-full h-40 overflow-hidden rounded-lg flex justify-end items-end">
        <Image
          src={banner}
          alt="Banner"
          fill
          sizes="180"
          className="object-cover"
        />
        <div className="bg-card-bg absolute h-full w-full opacity-0 transition-all duration-200 group-hover:opacity-50"></div>
        <Image
          src={`/icons/play_arrow.svg`}
          alt="Play button"
          width="42"
          height="42"
          className="invisible bg-card-bg rounded-2xl m-1 scale-70 transform transition-all duration-200 group-hover:visible group-hover:scale-100"
        />
      </div>
      <Link href={`/playlists/${id}`} className="w-full px-1">
        <h3 className="truncate text-xl font-medium">{name}</h3>
        <p className="text-secondary text-[15px]">{totalSongs} Songs</p>
      </Link>
    </div>
  );
}

export default PlaylistCard;
