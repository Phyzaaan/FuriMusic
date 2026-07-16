import PlaylistsStream from "./stream/playlist";
import PlaylistsSectionSkeleton from "../skeleton/sections/Playlists";
import { Suspense } from "react";
import PlaylistHeader from "./sections/Header";

export default function Playlist() {
  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <PlaylistHeader />

      {/* Playlists Section  */}
      <Suspense fallback={<PlaylistsSectionSkeleton carousel={false} />}>
        <PlaylistsStream />
      </Suspense>
    </main>
  );
}
