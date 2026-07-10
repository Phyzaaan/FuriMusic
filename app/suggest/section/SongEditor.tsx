"use client";

import { useState } from "react";
import EditorModal from "@/app/ui/components/editor/EditorModal";
import SongEditorForm, { type SongEditorFormValues } from "@/app/ui/components/editor/SongEditorForm";
import type { Song } from "@/app/utils/data/type";
import type { songDetails } from "@/app/utils/data/type";
import { Turnstile } from "@marsidev/react-turnstile";
import { downloadAndUploadSuggestionSong } from "@/app/utils/data/data";

interface SongEditorProps {
    Song: songDetails;
    showEditor: boolean;
    setShowEditor: (val: boolean) => void;
}

export default function SongEditor({ Song, showEditor, setShowEditor }: SongEditorProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState("");

    if (!showEditor) return null;

    const normalizedSong: Song = {
        id: 0,
        name: Song.name,
        url: Song.url,
        banner: Song.banner,
        duration: Song.duration,
        artists: [],
    };

    const onSubmit = async (payload: SongEditorFormValues) => {
        if (isSubmitting) return;
        if (!token) {
            alert("Please complete the CAPTCHA before submitting.");
            return;
        }
        setIsSubmitting(true);

        try {
            const existingArtistIds = (payload.artistsIds ?? []);
            const pendingArtists = payload.pendingArtists ?? [];

            const formData = new FormData();
            formData.append("name", payload.name);

            const ytUrl = Song.url;
            const url = await downloadAndUploadSuggestionSong(ytUrl, payload.name, token);

            formData.append("url", url);
            formData.append("duration", payload.duration || Song.duration);
            formData.append("lyrics", payload.lyrics || "");
            formData.append("existingArtistsIds", JSON.stringify(existingArtistIds));
            formData.append("pendingArtistsMeta", JSON.stringify(pendingArtists.map((artist) => artist.name)));

            let banner: File | string = payload.banner || Song.banner;
            if (payload.bannerFile) {
                banner = payload.bannerFile;
            }
            formData.append("banner", banner);

            pendingArtists.forEach((artist, index) => {
                formData.append(`pendingArtistBanner_${index}`, artist.bannerFile);
            });

            const response = await fetch("/api/uploadSong", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                window.alert("Suggestion submitted successfully for approval!");
                setShowEditor(false);
            } else {
                window.alert("Failed submitting suggestion.");
            }
        } catch (error) {
            console.error(error);
            window.alert("An unexpected network error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <EditorModal title="Submit Suggestion" onClose={() => setShowEditor(false)}>
                <SongEditorForm
                    initialSong={normalizedSong}
                    initialArtist={{ name: Song.artist_name, banner: Song.artist_banner }}
                    onSubmit={onSubmit}
                    showCreateArtist={true}
                    submitLabel={isSubmitting ? "Submitting..." : "Submit Suggestion"}
                    hideDelete
                />
            <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={setToken}
            />
            </EditorModal>
        </>
    );
}
