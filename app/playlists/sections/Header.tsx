"use client";
import { useState } from "react";
import useMusic from "@/app/musicProvider";
import PlaylistEditor from "@/app/playlists/sections/editor";
import { SecondaryBtn } from "@/app/ui/components/Buttons";

export default function PlaylistHeader() {
  const { isAdmin } = useMusic();
  const [showEditor, setShowEditor] = useState(false);

  return (
    <>
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Playlists Page</h1>
        {isAdmin && (
          <SecondaryBtn onClick={() => setShowEditor(true)}>
            Create Playlist
          </SecondaryBtn>
        )}
      </div>

      <PlaylistEditor showEditor={showEditor} setShowEditor={setShowEditor} />
    </>
  );
}