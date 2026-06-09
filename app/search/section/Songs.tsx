import SongsCard from "@/app/ui/components/Songcard";
import { Song } from "@/app/utils/data/type";
import ErrorMsg from "@/app/ui/components/Error";

type SongsSectionProps = {
  Songs: Song[] | undefined;
};

export default function AllSongsSection({ Songs }: SongsSectionProps) {
  return (
    <div className="no-scrollbar flex w-full flex-col gap-2 px-2 py-1">
      {Songs && Songs.length > 0 ? (Songs.map((song) => {
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
      <ErrorMsg>There is NOTING!</ErrorMsg>
      )}
    </div>
  );
}
