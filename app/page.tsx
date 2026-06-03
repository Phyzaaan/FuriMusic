import dynamic from "next/dynamic";
import { Suspense } from "react";
import SongsSectionSkeleton from "./skeleton/sections/SongsSectionSkeleton";
import ArtistsSectionSkeleton from "./skeleton/sections/ArtistsSectionSkeleton";
import PlaylistsSectionSkeleton from "./skeleton/sections/PlaylistsSectionSkeleton";
const PlaylistsStream = dynamic(() => import("./ui/stream/PlaylistsStream"));
const ArtistsStream = dynamic(() => import("./ui/stream/ArtistsStream"));
const SongsStream = dynamic(() => import("./ui/stream/SongsStream"));

export default async function Home() {
  return (
    <main className="flex w-full h-full flex-col overflow-y-auto no-scrollbar pt-22 pb-20">
      <Suspense fallback={<PlaylistsSectionSkeleton />}>
        <PlaylistsStream />
      </Suspense>
      <Suspense fallback={<SongsSectionSkeleton />}>
        <SongsStream />
      </Suspense>
      <Suspense fallback={<ArtistsSectionSkeleton />}>
        <ArtistsStream />
      </Suspense>
    </main>
  );
}

