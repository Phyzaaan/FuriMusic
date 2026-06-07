import SongsCard from "@/app/ui/components/Songcard";
import { Song } from "@/app/utils/data/type";

type SongsSectionProps = {
  Songs: Song[];
};

export default function SongsSection({ Songs }: SongsSectionProps) {
  return (
    <div className="no-scrollbar flex w-full flex-col gap-2 px-2 py-1">
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
