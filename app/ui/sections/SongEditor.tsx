"use client";

import SongTableEditor from "@/app/ui/components/editor/SongTableEditor";
import type { Song } from "@/app/utils/data/type";

interface SongEditorProps {
  Song: Song;
  showEditor: boolean;
  setShowEditor: (val: boolean) => void;
}

export default function SongEditor({ Song, showEditor, setShowEditor }: SongEditorProps) {
  return (
    <SongTableEditor
      song={Song}
      showEditor={showEditor}
      setShowEditor={setShowEditor}
      source="songs"
    />
  );
}
