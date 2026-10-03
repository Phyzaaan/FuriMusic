"use client";
import { useState } from "react";
import EditorModal from "@/app/ui/components/editor/EditorModal";
import SongEditorForm, { type SongEditorFormValues } from "@/app/ui/components/editor/SongEditorForm";
import type { Song } from "@/app/utils/data/type";
import type { songDetails } from "@/app/utils/data/type";
import { Turnstile } from "@marsidev/react-turnstile";
import { downloadAndUploadSuggestionSong } from "@/app/utils/data/data";
import getVideoId from "@/app/utils/libs/getVideoId";

interface SongEditorProps {
    Song: songDetails;
    showEditor: boolean;
    setShowEditor: (val: boolean) => void;
}

type SubmissionPhase = "idle" | "preparing" | "downloading" | "uploading" | "finishing" | "success" | "error";

export default function SongEditor({ Song, showEditor, setShowEditor }: SongEditorProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
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
        await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay for UX

        setIsSubmitting(true);
        updateSubmissionState("preparing", "Preparing your suggestion...", 0);

        try {
            const existingArtistIds = (payload.artistsIds ?? []);
            const pendingArtists = payload.pendingArtists ?? [];

            const formData = new FormData();
            formData.append("name", payload.name);

            setTimeout(() => updateSubmissionState("downloading", "Downloading and processing the audio...", 34), 1000);
            const ytUrl = Song.url;
            const url = await downloadAndUploadSuggestionSong(ytUrl, payload.name, token);

            const videoId = getVideoId(Song.url);
            if (videoId) formData.append("videoId", videoId);

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
                if (typeof artist.banner !== "string") {
                    formData.append(`pendingArtistBanner_${index}`, artist.banner);
                }
            });

            updateSubmissionState("uploading", "Uploading your song and artwork...", 72);
            const response = await fetch("/api/uploadSong", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                updateSubmissionState("finishing", "Finalizing your suggestion...", 100);
                window.setTimeout(() => {
                    setIsSubmitting(false);
                    updateSubmissionState("idle", "Preparing your suggestion...", 0);
                    setIsSubmitted(true);
                    window.setTimeout(() => {
                        setShowEditor(false);
                        setIsSubmitted(false);
                    }, 2500);
                }, 900);

                return;
            }

            throw new Error(response.statusText || "Failed to submit the suggestion. Please try again.");
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                updateSubmissionState("error", error.message, 0);
            } else {
                updateSubmissionState("error", error as string, 0);
            }
            setTimeout(() => {
                setIsSubmitting(false);
            }, 3000);
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
                        initialArtists={[{ name: Song.artist_name, banner: Song.artist_banner }]}
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
                                <div className="flex items-center gap-3 pb-3">
                                    <div className="h-10 w-10 shrink-0 animate-spin rounded-full border-3 border-t-transparent" />
                                    <div>
                                        <p className="text-lg font-semibold text-primary">{submissionMessage}</p>
                                        <p className="pt-1 text-sm text-tertiary">
                                            Note: download speed depends on your internet connection.
                                        </p>
                                    </div>
                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-card-border">
                                    <div
                                        className="h-full rounded-full bg-primary-gradient transition-all duration-500"
                                        style={{ width: `${submissionProgress}%` }}
                                    />
                                </div>

                                <div className="pt-3 flex items-center gap-2 text-xs text-tertiary">
                                    <span className={`h-2.5 w-2.5 rounded-full ${submissionPhase === "error" ? "bg-red-500" : "bg-green-400"}`} />
                                    <span>{submissionPhase === "error" ? "We hit a snag. You can try again after adjusting the form." : "This usually takes a few moments while we process the song."}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {isSubmitted && (
                        <div role="status" aria-live="polite" className="fixed inset-0 z-10 flex items-center justify-center rounded-lg bg-dark-bg/85 border-card-border px-4 py-6 backdrop-blur-sm">
                            {/* Self-contained keyframes so no tailwind config / global css changes are needed */}
                            <style>{`
                                @keyframes submitted-draw { to { stroke-dashoffset: 0; } }
                                @keyframes submitted-pop {
                                    0% { transform: scale(0.92); opacity: 0; }
                                    100% { transform: scale(1); opacity: 1; }
                                }
                                @keyframes submitted-rise {
                                    from { transform: translateY(6px); opacity: 0; }
                                    to { transform: translateY(0); opacity: 1; }
                                }
                                .submitted-card { animation: submitted-pop 0.25s ease-out both; }
                                .submitted-ring { stroke-dasharray: 1; stroke-dashoffset: 1; animation: submitted-draw 0.6s ease-out 0.1s forwards; }
                                .submitted-tick { stroke-dasharray: 1; stroke-dashoffset: 1; animation: submitted-draw 0.4s ease-out 0.65s forwards; }
                                .submitted-text { opacity: 0; animation: submitted-rise 0.4s ease-out 0.9s forwards; }
                                @media (prefers-reduced-motion: reduce) {
                                    .submitted-card, .submitted-ring, .submitted-tick, .submitted-text { animation: none; opacity: 1; stroke-dashoffset: 0; transform: none; }
                                }
                            `}</style>

                            <div className="submitted-card w-full max-w-md rounded-2xl border border-card-border bg-card-bg/95 p-5 shadow-2xl">
                                <div className="flex items-center gap-3 pb-3">
                                    {/* Same 40px circle as the loading spinner, now drawn in green with a tick */}
                                    <svg className="h-10 w-10 shrink-0 text-green-400" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                                        <circle cx="20" cy="20" r="18" fill="currentColor" fillOpacity="0.12" />
                                        <circle
                                            className="submitted-ring"
                                            cx="20"
                                            cy="20"
                                            r="18"
                                            pathLength="1"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            transform="rotate(-90 20 20)"
                                        />
                                        <path
                                            className="submitted-tick"
                                            d="M12 20.5l5.5 5.5L28 15"
                                            pathLength="1"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>

                                    <div className="submitted-text">
                                        <p className="text-lg font-semibold text-primary">Thank you!</p>
                                        <p className="pt-1 text-sm text-tertiary">
                                            Your song has been submitted successfully.
                                        </p>
                                    </div>
                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-card-border">
                                    <div className="h-full w-full rounded-full bg-green-400" />
                                </div>

                                <div className="pt-3 flex items-center gap-2 text-xs text-tertiary">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                    <span>All done. Thanks for contributing to the library!</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </EditorModal>
        </>
    );
}
