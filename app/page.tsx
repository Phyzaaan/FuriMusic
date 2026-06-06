import dynamic from "next/dynamic";
import { Suspense } from "react";
import TitleSkeleton from "./skeleton/components/Title";
import SongsSectionSkeleton from "./skeleton/sections/Songs";
import ArtistsSectionSkeleton from "./skeleton/sections/Artists";
import PlaylistsSectionSkeleton from "./skeleton/sections/Playlists";
const PlaylistsStream = dynamic(() => import("./ui/stream/PlaylistsStream"));
const ArtistsStream = dynamic(() => import("./ui/stream/ArtistsStream"));
const SongsStream = dynamic(() => import("./ui/stream/SongsStream"));

export default function Home() {
  return (
    <main className="flex w-full h-full flex-col overflow-y-auto no-scrollbar pt-22 pb-20">
      <Suspense fallback={
        <>
          <TitleSkeleton />
          <PlaylistsSectionSkeleton />
        </>
      }>
        <PlaylistsStream />
      </Suspense>
      <Suspense fallback={
        <>
          <TitleSkeleton />
          <SongsSectionSkeleton />
        </>
      }>
        <SongsStream />
      </Suspense>
      <Suspense fallback={
        <>
          <TitleSkeleton />
          <ArtistsSectionSkeleton />
        </>
      }>
        <ArtistsStream />
      </Suspense>
    </main>
  );
}

