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

type SubmissionPhase = "idle" | "preparing" | "downloading" | "uploading" | "finishing" | "success" | "error";

export default function SongEditor({ Song, showEditor, setShowEditor }: SongEditorProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState("");
    const [submissionPhase, setSubmissionPhase] = useState<SubmissionPhase>("idle");
    const [submissionMessage, setSubmissionMessage] = useState("Preparing your suggestion...");
    const [submissionProgress, setSubmissionProgress] = useState(0);

    if (!showEditor) return null;

    const normalizedSong: Song = {
        id: 0,
        name: Song.name,
        url: Song.url,
        banner: Song.banner,
        duration: Song.duration,
        artists: [],
    };

    const updateSubmissionState = (phase: SubmissionPhase, message: string, progress: number) => {
        setSubmissionPhase(phase);
        setSubmissionMessage(message);
        setSubmissionProgress(progress);
    };

    const onSubmit = async (payload: SongEditorFormValues) => {
        if (isSubmitting) return;
        if (!token) {
            alert("Please complete the CAPTCHA before submitting.");
            return;
        }

        setIsSubmitting(true);
        updateSubmissionState("preparing", "Preparing your suggestion...", 12);

        try {
            const existingArtistIds = (payload.artistsIds ?? []);
            const pendingArtists = payload.pendingArtists ?? [];

            const formData = new FormData();
            formData.append("name", payload.name);

            updateSubmissionState("downloading", "Downloading and processing the audio...", 36);
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

            updateSubmissionState("uploading", "Uploading your song and artwork...", 72);
            const response = await fetch("/api/uploadSong", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                updateSubmissionState("finishing", "Finalizing your suggestion...", 100);
                window.setTimeout(() => {
                    setShowEditor(false);
                    setIsSubmitting(false);
                    updateSubmissionState("idle", "Preparing your suggestion...", 0);
                    alert("Your suggestion has been submitted successfully!");
                }, 900);
                return;
            }

            updateSubmissionState("error", "Submission failed. Please try again.", 0);
            setIsSubmitting(false);
            window.alert("Failed submitting suggestion.");
        } catch (error) {
            console.error(error);
            updateSubmissionState("error", "A network issue interrupted the submission.", 0);
            setIsSubmitting(false);
            window.alert("An unexpected network error occurred.");
        }
    };

    return (
        <>
            <EditorModal
                title="Submit Suggestion"
                onClose={() => {
                    if (!isSubmitting) {
                        setShowEditor(false);
                    }
                }}
                disableClose={isSubmitting}
            >
                <div className="relative flex-1">
                    <SongEditorForm
                        initialSong={normalizedSong}
                        initialArtist={{ name: Song.artist_name, banner: Song.artist_banner }}
                        onSubmit={onSubmit}
                        submitLabel={isSubmitting ? "Submitting..." : "Submit Suggestion"}
                        hideDelete
                    >
                        <Turnstile
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                            onSuccess={setToken}
                        />
                    </SongEditorForm>

                    {isSubmitting && (
                        <div className="fixed inset-0 z-10 flex items-center justify-center rounded-lg bg-dark-bg/85 border-card-border px-4 py-6 backdrop-blur-sm">
                            <div className="w-full max-w-md rounded-2xl border border-card-border bg-card-bg/95 p-5 shadow-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 animate-spin rounded-full border-3 border-t-transparent" />
                                    <div>
                                        <p className="text-lg font-semibold text-primary">{submissionMessage}</p>
                                        <p className="pt-1 text-sm text-tertiary">
                                            Note: download speed depends on your internet connection.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-dark-bg">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-accent-from to-accent-to transition-all duration-500"
                                        style={{ width: `${submissionProgress}%` }}
                                    />
                                </div>

                                <div className="mt-3 flex items-center gap-2 text-xs text-tertiary">
                                    <span className={`h-2.5 w-2.5 rounded-full ${submissionPhase === "error" ? "bg-red-500" : "bg-green-400"}`} />
                                    <span>{submissionPhase === "error" ? "We hit a snag. You can try again after adjusting the form." : "This usually takes a few moments while we process the song."}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </EditorModal>
        </>
    );
}
