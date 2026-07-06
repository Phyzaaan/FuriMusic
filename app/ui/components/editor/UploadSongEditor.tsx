"use client";
import { useState } from "react";
import EditorModal from "@/app/ui/components/editor/EditorModal";
import SongEditorForm, { type SongEditorFormValues } from "@/app/ui/components/editor/SongEditorForm";
import { uploadSong, uploadArtist, uploadFile } from "@/app/utils/data/data";
import type { Song, SongEditorSource } from "@/app/utils/data/type";

interface UploadSongEditorProps {
    showEditor: boolean;
    setShowEditor: (value: boolean) => void;
    source?: SongEditorSource;
}

const emptySong: Song = {
    id: 0,
    name: "",
    url: "",
    banner: "",
    duration: "",
    artists: [],
    lyrics: "",
};

export default function UploadSongEditor({ showEditor, setShowEditor, source = "new" }: UploadSongEditorProps) {
    const [isSaving, setIsSaving] = useState(false);

    if (!showEditor) return null;

    const handleSubmit = async (payload: SongEditorFormValues) => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            let bannerUrl = payload.banner || "";
            if (payload.bannerFile) {
                const uploadedBanner = await uploadFile("songsBanner", payload.bannerFile, payload.name);
                if (!uploadedBanner) {
                    window.alert("Failed uploading song banner");
                    return;
                }
                bannerUrl = uploadedBanner;
            }

            const songUrl = payload.url || "";
            if (!songUrl && source === "new") {
                window.alert("A song URL is required");
                return;
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

            const artistIds: number[] = payload.artistsIds
                .map((artistId) => pendingArtistIds.get(artistId) ?? artistId)
                .filter((artistId) => artistId > 0);

            const result = await uploadSong({
                name: payload.name,
                banner: bannerUrl,
                url: songUrl,
                duration: payload.duration || "",
                artistsIds: artistIds,
                lyrics: payload.lyrics ?? "",
            });

            if (result) {
                window.alert("Song added successfully");
                setShowEditor(false);
                return;
            }

            window.alert("Failed adding song");
        } catch (error) {
            console.error(error);
            window.alert("Failed adding song");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <EditorModal title="Add Song" onClose={() => setShowEditor(false)}>
            <SongEditorForm
                initialSong={emptySong}
                onSubmit={handleSubmit}
                submitLabel={isSaving ? "Saving..." : "Add Song"}
                hideDelete
            />
        </EditorModal>
    );
}