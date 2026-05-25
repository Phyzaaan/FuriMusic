import Songs from "../data/songs";
import SongsCard from "../components/songcard";

export default function SongsPage() {
  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Songs Page</h1>
      </div>

      {/* Songs Section  */}
      <div className="no-scrollbar flex flex-col w-full gap-2 px-2 py-1">
        {Songs.map((song) => {
          return (
            <SongsCard
              key={song.id}
              songId={song.id}
              songName={song.name}
              artistName={song.artist}
              duration={song.duration}
              songImage={`/SongsBanner/${song.banner}`}
            />
          );
        })}
      </div>
    </main>
  );
}
