import PlaylistsSection from "./sections/Playlists";

export default function Playlist() {

  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Playlists Page</h1>
      </div>

      {/* Playlists Section  */}
      <PlaylistsSection />
    </main>
  );
}
