"use client";

import { useState } from "react";
import EditorModal from "@/app/ui/components/editor/EditorModal";
import SongEditorForm, { type SongEditorFormValues } from "@/app/ui/components/editor/SongEditorForm";
import { deleteItem, updateSong, uploadArtist, uploadFile, uploadSong } from "@/app/utils/data/data";
import type { Song, SongEditorSource } from "@/app/utils/data/type";

interface SongTableEditorProps {
  song: Song;
  showEditor: boolean;
  setShowEditor: (value: boolean) => void;
  source?: SongEditorSource;
}

export default function SongTableEditor({ song, showEditor, setShowEditor, source = "songs" }: SongTableEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  if (!showEditor) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this song?");
    if (!confirmed) return;

    let result: number | null = null;
    if (source === "suggestions") {
      result = await deleteItem("Suggestions", song.id);
    } else {
      result = await deleteItem("Songs", song.id);
    }

    if (result) {
      window.alert("Song deleted successfully");
      setShowEditor(false);
      return;
    }

    window.alert("Failed deleting song");
  };

  const handleSubmit = async (payload: SongEditorFormValues) => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      let bannerUrl = payload.banner || song.banner;
      if (payload.bannerFile) {
        const uploadedBanner = await uploadFile("songsBanner", payload.bannerFile, payload.name);
        if (!uploadedBanner) {
          window.alert("Failed uploading banner");
          return;
        }
        bannerUrl = uploadedBanner;
      }

      const pendingArtistIds = new Map<number, number>();
      for (const pendingArtist of payload.pendingArtists ?? []) {
        const uploadedArtistBanner = await uploadFile("artistsBanner", pendingArtist.bannerFile, pendingArtist.name);
        if (!uploadedArtistBanner) {
          window.alert(`Failed uploading banner for artist ${pendingArtist.name}`);
          return;
        }

        const createdArtistId = await uploadArtist({ name: pendingArtist.name, banner: uploadedArtistBanner });
        if (!createdArtistId) {
          window.alert(`Failed creating artist ${pendingArtist.name}`);
          return;
        }

        pendingArtistIds.set(pendingArtist.tempId, createdArtistId);
      }

      const resolvedArtistIds = payload.artistsIds
        .map((artistId) => pendingArtistIds.get(artistId) ?? artistId)
        .filter((artistId) => artistId > 0);

      if (source === "suggestions") {
        const createdSongId = await uploadSong({
          name: payload.name,
          banner: bannerUrl,
          url: payload.url || song.url,
          duration: payload.duration || song.duration,
          artistsIds: resolvedArtistIds,
          lyrics: payload.lyrics ?? song.lyrics ?? "",
        });

        if (createdSongId) {
          window.alert("Song uploaded to Songs table successfully");
          handleDelete();
          setShowEditor(false);
          return;
        }

        window.alert("Failed uploading song from suggestions");
        return;
      }

      const result = await updateSong({
        id: song.id,
        name: payload.name,
        banner: bannerUrl,
        artistsIds: resolvedArtistIds,
        lyrics: payload.lyrics ?? song.lyrics ?? "",
      });

      if (result) {
        window.alert("Song updated successfully");
        setShowEditor(false);
        return;
      }

      window.alert("Failed updating song");
    } catch (error) {
      console.error(error);
      window.alert("Failed saving song");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditorModal title={source === "suggestions" ? "Approve Song" : "Edit Song"} onClose={() => setShowEditor(false)}>
      <SongEditorForm
        initialSong={song}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        submitLabel={isSaving ? "Saving..." : source === "suggestions" ? "Approve to Songs" : "Save Changes"}
        deleteLabel="Delete"
      />
    </EditorModal>
  );
}
