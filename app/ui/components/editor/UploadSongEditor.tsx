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
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [uploadStep, setUploadStep] = useState<UploadStep>("upload");
    const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
    const [uploadedSongUrl, setUploadedSongUrl] = useState("");
    const [uploadedFileName, setUploadedFileName] = useState("");

    if (!showEditor) return null;

    const resetEditor = () => {
        setUploadStep("upload");
        setSelectedAudioFile(null);
        setUploadedSongUrl("");
        setUploadedFileName("");
    };

    const handleClose = () => {
        resetEditor();
        setShowEditor(false);
    };

    const handleUploadFile = async () => {
        if (!selectedAudioFile) {
            window.alert("Please choose an audio file first");
            return;
        }

        setIsUploadingFile(true);
        try {
            const uploadedUrl = await uploadFile("songs", selectedAudioFile, selectedAudioFile.name);
            if (!uploadedUrl) {
                window.alert("Failed uploading the song file");
                return;
            }

            setUploadedSongUrl(uploadedUrl);
            setUploadedFileName(selectedAudioFile.name);
            setUploadStep("details");
        } catch (error) {
            console.error(error);
            window.alert("Failed uploading the song file");
        } finally {
            setIsUploadingFile(false);
        }
    };

    const handleSubmit = async (payload: SongEditorFormValues) => {
        if (isSaving) return;
        if (!uploadedSongUrl) {
            window.alert("Please upload a song file before saving");
            return;
        }

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
                        Pick an audio file first. Once it is uploaded, you can fill in the details and save the song.
                    </div>


                    <div className="flex justify-between gap-2">
                        <SecondaryBtn type="button" onClick={handleClose} className="hover:bg-red-500">
                            Cancel
                        </SecondaryBtn>
                        <SecondaryBtn
                            type="button"
                            onClick={() => void handleUploadFile()}
                            disabled={isUploadingFile || !selectedAudioFile}
                            className="disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUploadingFile ? "Uploading..." : "Upload to database"}
                        </SecondaryBtn>
                    </div>
                </div>
            ) : (
                <>
                    <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300">
                        Audio file uploaded successfully as {uploadedFileName || "your selected song"}. You can now add the song details.
                    </div>
                    <SongEditorForm
                        initialSong={emptySong}
                        onSubmit={handleSubmit}
                        submitLabel={isSaving ? "Saving..." : "Add Song"}
                        hideDelete
                    />
                </>
            )}
        </EditorModal>
    );
}