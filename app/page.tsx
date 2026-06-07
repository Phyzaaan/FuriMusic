import dynamic from "next/dynamic";
import { Suspense } from "react";
import TitleSkeleton from "./skeleton/components/Title";
import SongsSectionSkeleton from "./skeleton/sections/Songs";
import PlaylistsSectionSkeleton from "./skeleton/sections/Playlists";
const PlaylistsStream = dynamic(() => import("./ui/stream/PlaylistsStream"));
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
    </main>
  );
}

