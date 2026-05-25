import Playlists from "../data/playlists";
import PlaylistCard from "../components/playlistCard";
import { SecondaryBtn } from "../components/buttons";

export default function Library() {
  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Your Library</h1>
        <SecondaryBtn>Create Playlist</SecondaryBtn>
      </div>

      {/* Playlists Section  */}
      <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 w-full gap-2 flex-wrap px-2 py-1">
        {Playlists.map((playlist) => {
          return (
            <PlaylistCard
              key={playlist.id}
              banner={playlist.banner}
              name={playlist.name}
              tracks={playlist.songs.length}
            />
          );
        })}
      </div>
    </main>
  );
}
