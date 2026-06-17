"use client";
import { useState } from "react";
import useMusic from "@/app/musicProvider";
import PlaylistEditor from "@/app/playlists/sections/editor";
import PlaylistsSection from "./sections/Playlists";
import { SecondaryBtn } from "@/app/ui/components/Buttons";


export default function Playlist() {
  const { isAdmin } = useMusic();
  const [showEditor, setshowEditor] = useState(false);


  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Playlists Page</h1>
        {isAdmin && (
          <SecondaryBtn
            onClick={() => setshowEditor(true)}
          >Create Playlist</SecondaryBtn>
        )}
      </div>

      {/* Playlists Section  */}
      <PlaylistsSection />

      {/* Playlist Editor  */}
      <PlaylistEditor showEditor={showEditor} setShowEditor={setshowEditor} />
    </main>
  );
}
