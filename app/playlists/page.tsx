import PlaylistCard from "../components/playlistCard";
import { fetchAllPlaylists } from "../data/data";

export default async function Playlist() {
  const Playlists = await fetchAllPlaylists();

  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Playlists Page</h1>
      </div>

      {/* Playlists Section  */}
      <div className="no-scrollbar grid grid-cols-2 sm:grid-cols-3 justify-items-center w-full justify-around gap-2 px-2 py-1">
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
