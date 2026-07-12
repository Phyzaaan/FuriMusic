"use client";
import { useState } from "react";
import EditorModal from "@/app/ui/components/editor/EditorModal";
import SongEditorForm, { type SongEditorFormValues } from "@/app/ui/components/editor/SongEditorForm";
import { SecondaryBtn } from "@/app/ui/components/Buttons";
import { uploadSong, uploadArtist, uploadFile } from "@/app/utils/data/data";
import type { Song } from "@/app/utils/data/type";

interface UploadSongEditorProps {
    showEditor: boolean;
    setShowEditor: (value: boolean) => void;
}

type UploadStep = "upload" | "details";

const emptySong: Song = {
    id: 0,
    name: "",
    url: "",
    banner: "",
    duration: "",
    artists: [],
    lyrics: "",
};

export default function UploadSongEditor({ showEditor, setShowEditor }: UploadSongEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [uploadStep, setUploadStep] = useState<UploadStep>("upload");
    const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);

    if (!showEditor) return null;

    const resetEditor = () => {
        setUploadStep("upload");
        setSelectedAudioFile(null);
    };

    const handleClose = () => {
        resetEditor();
        setShowEditor(false);
    };

    const handleNextStep = () => {
        if (!selectedAudioFile) {
            window.alert("Please choose an audio file first");
            return;
        }
        setUploadStep("details");
    };

    const handleSubmit = async (payload: SongEditorFormValues) => {
        if (isSaving) return;
        if (!selectedAudioFile) {
            window.alert("Audio file is missing");
            return;
        }

        setIsSaving(true);

        try {
            // 1. Upload the audio file first at the very end
            const uploadedSongUrl = await uploadFile("songs", selectedAudioFile, selectedAudioFile.name);
            if (!uploadedSongUrl) {
                window.alert("Failed uploading the song file");
                setIsSaving(false);
                return;
            }

            // 2. Upload banner if present
            let bannerUrl = payload.banner || "";
            if (payload.bannerFile) {
                const uploadedBanner = await uploadFile("songsBanner", payload.bannerFile, payload.name);
                if (!uploadedBanner) {
                    window.alert("Failed uploading song banner");
                    setIsSaving(false);
                    return;
                }
                bannerUrl = uploadedBanner;
            }

            // 3. Upload pending artists
            const pendingArtistIds = new Map<number, number>();
            for (const pendingArtist of payload.pendingArtists ?? []) {
                let artistBannerUrl = pendingArtist.banner as string;
                if (typeof pendingArtist.banner !== "string") {
                    const uploadArtistBanner = await uploadFile("artistsBanner", pendingArtist.banner, pendingArtist.name);
                    if (!uploadArtistBanner) {
                        window.alert(`Failed uploading banner for artist ${pendingArtist.name}`);
                        setIsSaving(false);
                        return;
                    }
                    artistBannerUrl = uploadArtistBanner;
                }

                const createdArtistId = await uploadArtist({ name: pendingArtist.name, banner: artistBannerUrl });
                if (!createdArtistId) {
                    window.alert(`Failed creating artist ${pendingArtist.name}`);
                    setIsSaving(false);
                    return;
                }

                pendingArtistIds.set(pendingArtist.tempId, createdArtistId);
            }

            const artistIds: number[] = payload.artistsIds
                .map((artistId) => pendingArtistIds.get(artistId) ?? artistId)
                .filter((artistId) => artistId > 0);

            // 4. Save the song with the newly retrieved audio URL
            const result = await uploadSong({
                name: payload.name,
                banner: bannerUrl,
                url: uploadedSongUrl,
                duration: payload.duration || "",
                artistsIds: artistIds,
                lyrics: payload.lyrics ?? "",
            });

            if (result) {
                window.alert("Song added successfully");
                handleClose();
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
        <EditorModal title={uploadStep === "upload" ? "Upload Song" : "Add Song"} onClose={handleClose}>
            {uploadStep === "upload" ? (
                <div className="flex flex-col gap-4 px-2 py-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-secondary">Audio file</label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={(event) => setSelectedAudioFile(event.target.files?.[0] ?? null)}
                            className="bg-dark-bg border-card-border w-full rounded-md border py-1 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-btn file:text-primary hover:file:bg-opacity-80 transition-all cursor-pointer"
                        />
                    </div>

                    <div className="rounded-lg border border-card-border bg-dark-bg px-3 py-2 text-sm text-secondary">
                        Pick an audio file first. Then you can fill in the details and everything will save at once.
                    </div>

                    <div className="flex justify-between gap-2">
                        <SecondaryBtn type="button" onClick={handleClose} className="hover:bg-red-500">
                            Cancel
                        </SecondaryBtn>
                        <SecondaryBtn
                            type="button"
                            onClick={handleNextStep}
                            disabled={!selectedAudioFile}
                            className="disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Next: Song Details
                        </SecondaryBtn>
                    </div>
                </div>
            ) : (
                <>
                    <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300">
                        Audio file selected: {selectedAudioFile?.name}. It will be uploaded when you submit.
                    </div>
                    <SongEditorForm
                        initialSong={emptySong}
                        onSubmit={handleSubmit}
                        submitLabel={isSaving ? "Uploading & Saving..." : "Add Song"}
                        hideDelete
                    />
                </>
            )}
        </EditorModal>
    );
}