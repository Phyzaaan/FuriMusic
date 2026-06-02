import dynamic from "next/dynamic";

const PlaylistsStream = dynamic(() => import("./ui/stream/PlaylistsStream"));
const ArtistsStream = dynamic(() => import("./ui/stream/ArtistsStream"));
const SongsStream = dynamic(() => import("./ui/stream/SongsStream"));

export default async function Home() {
  return (
    <main className="flex w-full h-full flex-col overflow-y-auto no-scrollbar pt-22 pb-20">
      <PlaylistsStream />
      <SongsStream />
      <ArtistsStream />
    </main>
  );
}

