import SongsCard from "@/app/ui/components/songcard";
import useMusic from "@/app/musicProvider";
import { Song } from "@/app/utils/data/type";

type SongsSectionProps = {
  songs: Song[];
};

export default function SongsSection({ songs }: SongsSectionProps) {
  const { setQueue } = useMusic();

  function handleQueue() {
    setQueue(songs);
  }

  return (
    <div className="no-scrollbar flex w-full flex-col gap-2 px-2 py-1">
      {songs.map((song) => {
        return (
          <SongsCard
            key={song.id}
            id={song.id}
            name={song.name}
            artists={song.artists}
            duration={song.duration}
            banner={song.banner}
            url={song.url}
            lyrics={song.lyrics}
            handleQueue={handleQueue}
          />
        );
      })}
    </div>
  );
}
