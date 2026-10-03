"use client";
import { useState } from "react";
import useMusic from "@/app/musicProvider";
import PlaylistEditor from "@/app/playlists/sections/editor";
import { SecondaryBtn } from "@/app/ui/components/Buttons";
import PlaylistFilters from "../../ui/components/Fiter";
import { Sort } from "@/app/utils/libs/sort";

export default function PlaylistHeader({ sort }: { sort: Sort; }) {
  const { isAdmin } = useMusic();
  const [showEditor, setShowEditor] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between gap-3 px-2 py-1">
        <h1 className="text-3xl font-semibold">Playlists Page</h1>
        <div>
          <PlaylistFilters current={sort} target="playlists" />
          {isAdmin && (
            <SecondaryBtn onClick={() => setShowEditor(true)}>
              Create Playlist
            </SecondaryBtn>
          )}
        </div>
      </div>

      <PlaylistEditor showEditor={showEditor} setShowEditor={setShowEditor} />
    </>
  );
}