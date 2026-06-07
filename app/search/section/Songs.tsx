import SongsCard from "@/app/ui/components/Songcard";
import { Song } from "@/app/utils/data/type";

type SongsSectionProps = {
  Songs: Song[];
};

export default function AllSongsSection({ Songs }: SongsSectionProps) {
  return (
    <div className="no-scrollbar flex w-full flex-col gap-2 px-2 py-1">
      {Songs.length > 0 ? (Songs.map((song) => {
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
      })) : (
      <h1 className="w-full text-center mx-auto my-auto">There is Nothing</h1>
      )}
    </div>
  );
}
