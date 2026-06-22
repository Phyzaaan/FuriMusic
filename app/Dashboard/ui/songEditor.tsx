"use client";
import { updateSong, uploadArtist, uploadFile, deleteItem, fetchArtistsRange } from "@/app/utils/data/data";
import { song } from "@/app/utils/data/type";
import { useEffect, useMemo, useState } from "react";

import { useForm } from "react-hook-form";
import { SecondaryBtn, PrimaryBtn } from "@/app/ui/components/Buttons";

interface SongEditorProps {
    Song: song;
    showEditor: boolean;
    setShowEditor: (val: boolean) => void;
}

type SongForm = {
    id: number;
    name: string;
    banner: string;
    artistsIds: number[];
    lyrics?: string | null | undefined;
};

export default function SongEditor({ Song, showEditor, setShowEditor }: SongEditorProps) {
    const [selectedArtistIds, setSelectedArtistIds] = useState<number[]>([]);

    const [songBanner, setSongBanner] = useState<File>()

    const [artistsResults, setArtistsResults] = useState<{ id: number; name: string }[]>([]);

    const [knownArtists, setKnownArtists] = useState<Map<number, { id: number; name: string }>>();

    const [artistsFilter, setArtistsFilter] = useState("");
    const [isLoadingArtists, setIsLoadingArtists] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);
    const [newArtistName, setNewArtistName] = useState("");
    const [newArtistBanner, setNewArtistBanner] = useState<File>();

    // Update registry whenever search results come in
    const updateKnownArtists = (list: { id: number; name: string }[]) => {
        setKnownArtists(prev => {
            const next = new Map(prev);
            list.forEach(a => next.set(a.id, a));
            return next;
        });
    };

    const { register, handleSubmit, setValue } = useForm<SongForm>({
        defaultValues: {
            id: Song.id,
            name: Song.name,
            banner: Song.banner,
            artistsIds: selectedArtistIds,
            lyrics: Song.lyrics
        },
    });

    useEffect(() => {
        if (Song.lyrics !== undefined) {
            setValue("lyrics", Song.lyrics);
        }
    }, [Song.lyrics, setValue]);

    const selectedArtists = useMemo(() => {
        return selectedArtistIds
            .map(id => knownArtists?.get(id))
            .filter((a): a is { id: number; name: string } => !!a);
    }, [selectedArtistIds, knownArtists]);



    const onSubmit = async (data: SongForm) => {
        const payload = { ...data, artistsIds: selectedArtistIds };

        if (songBanner) {
            const uploadedUrl = await uploadFile("songsBanner", songBanner, data.name);
            if (!uploadedUrl) {
                window.alert(`Failed uploading ${songBanner}`)
                return;
            }
            payload.banner = uploadedUrl;
            setValue("banner", uploadedUrl);
        }

        const res = await updateSong(payload);

        if (res) {
            window.alert(`${Song.name} is Updated Successfully!`);
            return;
        }

        window.alert(`Failed Updating ${Song.name}`)
    };

    const handleDelete = async () => {
        const userConfirmed = window.confirm("Are you sure you want to delete this Song?");
        if (!userConfirmed) return;
        const res = await deleteItem("Songs", Song.id);
        if (res) window.alert(`${Song.name} is Removed!`);
        else window.alert(`Failed Deleting ${Song.name}`)
    };

    const searchArtists = async (value: string) => {
        setIsLoadingArtists(true);
        try {
            const data = await fetchArtistsRange(12, 0, value);
            if (!data) {
                setArtistsResults([]);
                return;
            }
            const simplified = data.map((a) => ({ id: a.id, name: a.name }));
            setArtistsResults(simplified);
            updateKnownArtists(simplified);
        } finally {
            setIsLoadingArtists(false);
        }
    };

    const toggleArtist = (artistId: number) => {
        setSelectedArtistIds((prev) => {
            const exists = prev.includes(artistId);
            const next = exists ? prev.filter((x) => x !== artistId) : [...prev, artistId];

            setValue("artistsIds", next);

            return next;
        });
    };


    const onCreateArtist = async () => {
        if (!newArtistName.trim()) {
            window.alert("Artist name is required");
            return;
        }
        if (!newArtistBanner) {
            window.alert("Artist banner is required");
            return;
        }

        const uploadedUrl = await uploadFile("artistsBanner", newArtistBanner, newArtistName);
        if (!uploadedUrl) {
            window.alert(`Failed uploading banner for ${newArtistName}`)
            return;
        }

        const id = await uploadArtist({ name: newArtistName.trim(), banner: uploadedUrl });
        if (!id) {
            window.alert("Failed creating artist");
            return;
        }

        setCreateOpen(false);
        setNewArtistName("");
        setNewArtistBanner(undefined);

        // Select the new artist and refresh results
        setSelectedArtistIds((prev) => {
            const next = prev.includes(id) ? prev : [...prev, id];
            // Keep react-hook-form in sync
            setValue("artistsIds", next);
            return next;
        });
        const created = { id, name: newArtistName.trim() };
        setArtistsResults((prev) => [created, ...prev]);
        updateKnownArtists([created]);

        window.alert("Artist created successfully");
    };

    if (!showEditor) return null;

    return (
        <div className="absolute z-50 top-21 left-0 right-0 mx-auto w-full max-w-2xl flex flex-col max-h-[calc(100vh-81px)] bg-card-bg border border-card-border rounded-lg shadow-2xl backdrop-blur-2xl overflow-hidden">
            <div className="px-4 py-2 border-b border-card-border bg-dark-bg flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight text-primary">Edit Song</h1>
                <PrimaryBtn
                    type="button"
                    icon="/icons/close.svg"
                    width={24}
                    height={24}
                    onClick={() => setShowEditor(false)}
                />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-2 py-1 flex flex-col gap-2 no-scrollbar">
                <div className="flex items-center w-full gap-2 py-1">
                    {/* Banner Section */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-secondary">Song Banner</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSongBanner(e.target.files?.[0])}
                            className="bg-dark-bg border-card-border w-full rounded-md border py-1 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-btn file:text-primary hover:file:bg-opacity-80 transition-all cursor-pointer"
                        />
                    </div>

                    {/* Name Section */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-secondary">Song Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Song name..."
                            className="bg-dark-bg border-card-border w-full text-lg rounded-md border px-2 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
                        />
                    </div>
                </div>

                {/* Selected artists */}
                <div className="flex flex-col gap-1 pb-1">
                    <label className="text-sm font-semibold text-tertiary">Selected Artists ({selectedArtists.length})</label>
                    <div className="flex gap-2 max-h-45 flex-wrap overflow-y-auto no-scrollbar shrink-0 px-2 py-2 border border-card-border rounded-md bg-dark-bg">
                        {selectedArtists.length > 0 ? (
                            selectedArtists.map(a => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => toggleArtist(a.id)}
                                    className="rounded-lg px-2 py-1 text-xs border bg-card-bg border-card-border text-secondary hover:border-card-border hover:text-primary hover:bg-red-500/30 cursor-pointer transition-all duration-100"
                                >
                                    {a.name}
                                </button>
                            ))
                        ) : (
                            <span>No artists selected</span>
                        )}
                    </div>
                </div>

                {/* Add Artists */}
                <div className="flex flex-col gap-1 pb-1">
                    <label className="text-sm font-semibold text-tertiary">Add More Artists</label>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={artistsFilter}
                                onChange={(e) => setArtistsFilter(e.target.value)}
                                placeholder="Search artists..."
                                className="bg-dark-bg border-card-border grow rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
                            />
                            <SecondaryBtn
                                type="button"
                                onClick={() => searchArtists(artistsFilter)}
                                disabled={isLoadingArtists}
                                className="whitespace-nowrap min-w-25 bg-card-bg py-2 text-sm"
                            >
                                {isLoadingArtists ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Searching
                                    </span>
                                ) : "Search"}
                            </SecondaryBtn>
                        </div>

                        <div className="w-full max-h-34 p-2 border border-card-border rounded-lg bg-dark-bg overflow-y-auto no-scrollbar">
                            {artistsResults.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {artistsResults.map((a) => {
                                        const selected = selectedArtistIds.includes(a.id);
                                        return (
                                            <button
                                                key={a.id}
                                                type="button"
                                                onClick={() => toggleArtist(a.id)}
                                                className={`rounded-lg px-2 py-1 text-xs border transition-all duration-200 cursor-pointer ${selected
                                                    ? "bg-dark-bg border-card-border shadow-lg hover:bg-red-500/30"
                                                    : "bg-card-bg border-transparent text-secondary hover:border-card-border hover:text-primary"
                                                    }`}
                                            >
                                                {a.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <span>Search results will appear here</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create artist */}
                <div className="w-full">
                    {createOpen ? (
                        <div className="flex flex-col gap-2 bg-card-bg border border-card-border rounded-md px-2 py-2">
                            {/* Banner Section */}
                            <div className="flex flex-col gap-1 pb-1">
                                <label className="text-sm font-medium text-secondary">Artist Banner</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewArtistBanner(e.target.files?.[0])}
                                    className="border-card-border bg-dark-bg w-full rounded-md border py-1 text-sm file:mx-auto file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-btn file:text-primary hover:file:bg-opacity-80 transition-all cursor-pointer"
                                />
                            </div>

                            {/* Name Section */}
                            <div className="flex flex-col gap-1 pb-1">
                                <label className="text-sm font-medium text-secondary">Artist Name</label>
                                <input
                                    type="text"
                                    value={newArtistName}
                                    onChange={(e) => setNewArtistName(e.target.value)}
                                    placeholder="New artist name"
                                    className="bg-dark-bg border-card-border w-full rounded-md border px-2 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
                                />
                            </div>
                            <div className="flex justify-between gap-2">
                                <SecondaryBtn type="button" onClick={onCreateArtist} className="hover:bg-green-500/50">
                                    Create
                                </SecondaryBtn>
                                <SecondaryBtn
                                    type="button"
                                    onClick={() => setCreateOpen(false)}
                                    className="hover:bg-transparent border-transparent hover:text-red-400 "
                                >
                                    Cancel
                                </SecondaryBtn>
                            </div>
                        </div>
                    ) : (
                        <SecondaryBtn type="button" onClick={() => setCreateOpen(true)} className="bg-card-bg px-2">
                            Create Artist
                        </SecondaryBtn>
                    )}
                </div>


                {/* Lyrics */}
                <textarea
                    {...register("lyrics")}
                    placeholder="No Lyrics yet..."
                    className="bg-dark-bg border-card-border flex w-full h-full shrink-0 items-center justify-between rounded-md border px-2 py-1"
                />

                {/* Sticky Footer */}
                <div className=" flex justify-between items-center py-2">
                    <SecondaryBtn
                        type="button"
                        onClick={handleDelete}
                        className="text-red-400 hover:bg-red-600 hover:text-primary transition-all"
                    >
                        Delete
                    </SecondaryBtn>
                    <SecondaryBtn
                        type="submit"
                        className="font-bold transition-all hover:bg-green-500/50"
                    >
                        Save Changes
                    </SecondaryBtn>

                </div>
            </form>

        </div>
    );
}