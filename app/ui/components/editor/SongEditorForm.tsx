"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { SecondaryBtn } from "@/app/ui/components/Buttons";
import { fetchArtistsRange } from "@/app/utils/data/data";
import type { Song } from "@/app/utils/data/type";

export type PendingArtistDraft = {
  tempId: number;
  name: string;
  banner: File | string;
};

export type SongEditorFormValues = {
  id?: number;
  name: string;
  banner: string;
  url?: string;
  duration?: string;
  lyrics?: string | null;
  artistsIds: number[];
  pendingArtists?: PendingArtistDraft[];
  bannerFile?: File | null;
};

interface SongEditorFormProps {
  initialSong: Song;
  initialArtists?: { name: string, banner: string }[];
  onSubmit: (payload: SongEditorFormValues) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  submitLabel?: string;
  deleteLabel?: string;
  hideDelete?: boolean;
  children?: ReactNode;
}

export default function SongEditorForm({
  initialSong,
  initialArtists,
  onSubmit,
  onDelete,
  submitLabel = "Save Changes",
  deleteLabel = "Delete",
  hideDelete = false,
  children,
}: SongEditorFormProps) {
  const [selectedArtistIds, setSelectedArtistIds] = useState<number[]>(() => initialSong.artists?.map((artist) => artist.id) ?? []);
  const [songBanner, setSongBanner] = useState<File | null>(null);
  const [songBannerPreview, setSongBannerPreview] = useState<string>(initialSong.banner ?? "");

  const [artistsResults, setArtistsResults] = useState<{ id: number; name: string }[]>([]);
  const [knownArtists, setKnownArtists] = useState<Map<number, { id: number; name: string }>>(() => {
    const initial = new Map<number, { id: number; name: string }>();
    (initialSong.artists ?? []).forEach((artist) => initial.set(artist.id, artist));
    return initial;
  });
  const [artistsFilter, setArtistsFilter] = useState("");
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newArtistName, setNewArtistName] = useState(initialArtists && initialArtists.length > 0 ? initialArtists[0].name : "");
  const [newArtistBanner, setNewArtistBanner] = useState<File | null>(null);


  useEffect(() => {
    if (!initialArtists || !(initialArtists.length > 0)) return;
    const fetchArtistBanner = async () => {
      if (initialArtists[0].banner.includes("supabase")) return;
      try {
        const file = await fetch(initialArtists[0].banner).then((res) => res.blob()).then((blob) => new File([blob], "banner.jpg", { type: blob.type }));
        setNewArtistBanner(file);
      } catch (error) {
        alert("Failed to fetch artist banner. Please upload a new banner.");
        console.error("Error fetching artist banner:", error);
      }
    }
    fetchArtistBanner();
  }, [initialArtists]);

  const [artistBannerPreview, setArtistBannerPreview] = useState<string>(initialArtists && initialArtists.length > 0 ? initialArtists[0].banner : "");
  const [pendingArtists, setPendingArtists] = useState<PendingArtistDraft[]>([]);

  const { register, handleSubmit, setValue } = useForm<SongEditorFormValues>({
    defaultValues: {
      id: initialSong.id,
      name: initialSong.name,
      banner: initialSong.banner,
      url: initialSong.url,
      duration: initialSong.duration,
      lyrics: initialSong.lyrics ?? "",
      artistsIds: selectedArtistIds,
    },
  });

  const updateKnownArtists = (list: { id: number; name: string }[]) => {

    setKnownArtists((prev) => {
      const next = new Map(prev);
      list.forEach((artist) => next.set(artist.id, artist));
      return next;
    });
  };

  const selectedArtists = useMemo(() => {
    return selectedArtistIds
      .map((id) => knownArtists.get(id))
      .filter((artist): artist is { id: number; name: string } => !!artist);
  }, [selectedArtistIds, knownArtists]);

  useEffect(() => {
    setValue("artistsIds", selectedArtistIds);
  }, [selectedArtistIds, setValue]);


  useEffect(() => {
    if (!initialArtists || !(initialArtists.length > 0)) return;

    initialArtists.forEach((artist) => {
      if (artist.banner.includes("supabase")) {
        const tempArtistId = -(Date.now() + Math.floor(Math.random() * 1000000));
        const created = { tempId: tempArtistId, name: artist.name.trim(), banner: artist.banner };

        setPendingArtists((prev) => prev.some(p => p.name === created.name) ? prev : [...prev, created]);

        setSelectedArtistIds((prev) => {
          const next = prev.includes(tempArtistId) ? prev : [...prev, tempArtistId];
          setValue("artistsIds", next);
          return next;
        });
        updateKnownArtists([{ id: tempArtistId, name: created.name }]);
        setArtistsResults((prev) => [{ id: tempArtistId, name: created.name }, ...prev]);
      }
    })
    // eslint-disable-next-line
  }, [initialArtists])

  const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB

  const handleBannerChange = (file: File | null, isSong: boolean) => {
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image must be under 500 KB.");
      return;
    }

    const preview = URL.createObjectURL(file);

    if (isSong) {
      setSongBanner(file);
      setSongBannerPreview(preview);
    } else {
      setNewArtistBanner(file);
      setArtistBannerPreview(preview);
    }
  };

  const toggleArtist = (artistId: number) => {
    setSelectedArtistIds((prev) => {
      const next = prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [...prev, artistId];
      setValue("artistsIds", next);
      return next;
    });
  };

  const searchArtists = async (value: string) => {
    if (!value.trim()) return;
    setIsLoadingArtists(true);
    try {
      const foundArtists = await fetchArtistsRange(12, 0, value);
      const simplified = (foundArtists ?? []).map((artist) => ({ id: artist.id, name: artist.name }));
      setArtistsResults(simplified);
      updateKnownArtists(simplified);
    } finally {
      setIsLoadingArtists(false);
    }
  };

  const handleCreateLocalArtist = () => {
    if (!newArtistName.trim()) {
      window.alert("Artist name is required");
      return;
    }
    if (!newArtistBanner) {
      window.alert("Artist banner is required");
      return;
    }

    const tempArtistId = -(Date.now() + Math.floor(Math.random() * 1000000));
    const created = { tempId: tempArtistId, name: newArtistName.trim(), banner: newArtistBanner };

    setPendingArtists((prev) => [...prev, created]);
    setSelectedArtistIds((prev) => {
      const next = prev.includes(tempArtistId) ? prev : [...prev, tempArtistId];
      setValue("artistsIds", next);
      return next;
    });
    updateKnownArtists([{ id: tempArtistId, name: created.name }]);
    setArtistsResults((prev) => [{ id: tempArtistId, name: created.name }, ...prev]);
    setNewArtistName("");
    setArtistBannerPreview("");
    setNewArtistBanner(null);
    setCreateOpen(false);
  };

  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;

    if (event.key === "Enter" && target.tagName !== "BUTTON" && target.tagName !== "TEXTAREA") {
      event.preventDefault();
      event.stopPropagation();
    }
  };


  const submitForm = async (data: SongEditorFormValues) => {
    if (createOpen) {
      alert("Please finish creating the new artist before submitting the Song.");
      return;
    }
    const activePending = pendingArtists.filter(p => selectedArtistIds.includes(p.tempId));

    await onSubmit({
      ...data,
      artistsIds: selectedArtistIds,
      pendingArtists: activePending,
      bannerFile: songBanner,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} onKeyDown={handleFormKeyDown} className="flex flex-col gap-3 px-1 pt-2 pb-14 md:pb-2">

      {/* ───────── Song details ───────── */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-card-border bg-dark-bg/40">
        <div className="flex items-center justify-between gap-2 border-b border-card-border bg-dark-bg/60 px-3 py-2">
          <h3 className="text-sm font-semibold text-primary">Song details</h3>
        </div>

        <div className="flex flex-col gap-4 p-3">
          {/* Banner (preview and drop box share the same width + aspect ratio) */}
          <div className="flex w-full shrink-0 flex-col gap-2">
            <span className="text-sm font-medium text-secondary">Song banner</span>
            {songBannerPreview ? (
              <div className="relative">
                <Image src={songBannerPreview} alt="Song banner preview" width={360} height={360} className="w-full aspect-3/2 rounded-lg object-cover border border-card-border" />
                <SecondaryBtn
                  type="button"
                  onClick={() => {
                    setSongBanner(null);
                    setSongBannerPreview("");
                  }}
                  className="absolute bottom-2 right-2 bg-dark-bg/80"
                >
                  Remove
                </SecondaryBtn>
              </div>
            ) : (
              <div className="relative flex w-full aspect-3/2 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-card-border bg-dark-bg p-3 text-center transition-all hover:border-accent-from hover:bg-card-bg focus-within:border-accent-from focus-within:ring-2 focus-within:ring-accent-from">
                <svg className="pointer-events-none h-7 w-7 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                  <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                </svg>
                <span className="pointer-events-none text-sm font-medium text-primary">Click to upload</span>
                <span className="pointer-events-none text-xs text-tertiary">or drag and drop an image</span>
                <input
                  type="file"
                  accept="image/*"
                  title=""
                  aria-label="Upload song banner"
                  onChange={(event) => handleBannerChange(event.target.files?.[0] ?? null, true)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            )}
          </div>

          <div className="flex flex-1 min-w-0 flex-col gap-2">
            <label htmlFor="song-name" className="text-sm font-medium text-secondary">Song name</label>
            <input
              id="song-name"
              type="text"
              {...register("name")}
              placeholder="Song name..."
              className="bg-dark-bg border-card-border w-full text-lg rounded-lg border px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent-from transition-all"
            />
          </div>
        </div>
      </section>

      {/* ───────── Artists ───────── */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-card-border bg-dark-bg/40">
        <div className="flex items-center justify-between gap-2 border-b border-card-border bg-dark-bg/60 px-3 py-2">
          <h3 className="text-sm font-semibold text-primary">Artists</h3>
          <span className="rounded-md border border-card-border bg-card-bg px-2 py-0.5 text-xs text-secondary">
            {selectedArtists.length} selected
          </span>
        </div>

        <div className="flex flex-col gap-4 p-3">
          {/* Selected */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-secondary">Selected artists</span>
              {selectedArtists.length > 0 && <span className="text-xs text-tertiary">Tap to remove</span>}
            </div>
            <div className="flex gap-2 min-h-14 max-h-45 flex-wrap content-start items-start overflow-y-auto no-scrollbar shrink-0 p-2 border border-card-border rounded-lg bg-dark-bg">
              {selectedArtists.length > 0 ? (
                selectedArtists.map((artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    title="Remove artist"
                    onClick={() => toggleArtist(artist.id)}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm border bg-card-bg border-card-border text-primary hover:bg-red-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-from cursor-pointer transition-all duration-100"
                  >
                    {artist.name}
                    <span aria-hidden="true" className="text-xs text-tertiary">✕</span>
                  </button>
                ))
              ) : (
                <span className="w-full py-2 text-center text-sm text-tertiary">No artists selected yet</span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-2">
            <label htmlFor="artist-search" className="text-sm font-medium text-secondary">Add more artists</label>
            <div className="flex items-center gap-2">
              <input
                id="artist-search"
                type="text"
                value={artistsFilter}
                onChange={(event) => setArtistsFilter(event.target.value)}
                placeholder="Search artists..."
                className="bg-dark-bg border-card-border grow min-w-0 rounded-lg border px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent-from transition-all"
              />
              <SecondaryBtn
                type="button"
                onClick={() => searchArtists(artistsFilter)}
                disabled={isLoadingArtists}
                className="whitespace-nowrap min-w-25 bg-card-bg py-2 text-sm"
              >
                {isLoadingArtists ? "Searching..." : "Search"}
              </SecondaryBtn>
            </div>

            <div className="w-full min-h-14 max-h-34 p-2 border border-card-border rounded-lg bg-dark-bg overflow-y-auto no-scrollbar">
              {artistsResults.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {artistsResults.map((artist) => {
                    const selected = selectedArtistIds.includes(artist.id);
                    return (
                      <button
                        key={artist.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleArtist(artist.id)}
                        className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-from transition-all duration-200 cursor-pointer ${selected ? "bg-dark-bg border-accent-from text-primary shadow-lg hover:bg-red-500/30" : "bg-card-bg border-transparent text-secondary hover:border-card-border hover:text-primary"}`}
                      >
                        {selected && <span aria-hidden="true" className="text-xs">✓</span>}
                        {artist.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span className="block w-full py-2 text-center text-sm text-tertiary">Search results will appear here</span>
              )}
            </div>
          </div>

          {/* Create artist */}
          <div className="relative w-full border-t border-card-border pt-3">
            {createOpen ? (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-3 py-4 backdrop-blur-sm">
                <div className="flex max-h-[min(80vh,42rem)] w-full max-w-lg flex-col gap-2 overflow-y-auto rounded-xl border border-card-border bg-dark-bg/95 px-4 py-4 shadow-2xl shadow-black/50 backdrop-blur-xl no-scrollbar">
                  <div className="pb-2 border-b border-card-border bg-dark-bg flex justify-between items-center">
                    <h3 className="text-md font-semibold text-primary">New artist</h3>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col gap-2 w-42 shrink-0">
                      <span className="text-sm font-medium text-secondary">Banner</span>
                      {artistBannerPreview ? (
                        <div className="relative">
                          <Image src={artistBannerPreview} alt="Artist banner preview" width={360} height={360} className="w-full aspect-square rounded-lg object-cover border border-card-border" />
                          <SecondaryBtn
                            type="button"
                            onClick={() => {
                              setNewArtistBanner(null);
                              setArtistBannerPreview("");
                            }}
                            className="absolute bottom-1 right-1 bg-dark-bg/80 text-xs"
                          >
                            Remove
                          </SecondaryBtn>
                        </div>
                      ) : (
                        <div className="relative flex w-full aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-card-border bg-dark-bg p-2 text-center transition-all hover:border-accent-from hover:bg-card-bg focus-within:border-accent-from focus-within:ring-2 focus-within:ring-accent-from">
                          <svg className="pointer-events-none h-6 w-6 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                          </svg>
                          <span className="pointer-events-none text-xs font-medium text-primary">Upload</span>
                          <span className="pointer-events-none text-xs text-tertiary">or drop here</span>
                          <input
                            type="file"
                            accept="image/*"
                            title=""
                            aria-label="Upload artist banner"
                            onChange={(event) => handleBannerChange(event.target.files?.[0] ?? null, false)}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 min-w-0 flex-col gap-2">
                      <label htmlFor="new-artist-name" className="text-sm font-medium text-secondary">Artist name</label>
                      <input
                        id="new-artist-name"
                        type="text"
                        value={newArtistName}
                        onChange={(event) => setNewArtistName(event.target.value)}
                        placeholder="New artist name"
                        className="bg-dark-bg border-card-border w-full rounded-lg border px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent-from transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <SecondaryBtn type="button" onClick={() => setCreateOpen(false)} className="hover:bg-transparent border-transparent hover:text-red-400">
                      Cancel
                    </SecondaryBtn>
                    <SecondaryBtn type="button" onClick={() => void handleCreateLocalArtist()} className="px-4 font-semibold hover:bg-green-500/50">
                      Create
                    </SecondaryBtn>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-tertiary">Can&apos;t find an artist?</span>
                <SecondaryBtn type="button" onClick={() => setCreateOpen(true)} className="bg-card-bg px-3">
                  Create artist
                </SecondaryBtn>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────── Lyrics ───────── */}
      <section className="flex flex-col overflow-hidden rounded-xl border border-card-border bg-dark-bg/40">
        <div className="flex items-center justify-between gap-2 border-b border-card-border bg-dark-bg/60 px-3 py-2">
          <label htmlFor="song-lyrics" className="text-sm font-semibold text-primary">Lyrics</label>
        </div>
        <div className="flex flex-col p-3">
          <textarea
            id="song-lyrics"
            {...register("lyrics")}
            placeholder="Paste lyrics here if you have them..."
            className="bg-dark-bg border-card-border flex w-full min-h-56 shrink-0 resize-y rounded-lg border px-3 py-2 text-sm leading-relaxed text-primary focus:outline-none focus:ring-2 focus:ring-accent-from transition-all"
          />
        </div>
      </section>

      {children}

      {/* ───────── Actions ───────── */}
      <div className="flex items-center justify-between gap-2 border-t border-card-border pt-3">
        {!hideDelete ? (
          <SecondaryBtn type="button" onClick={() => void onDelete?.()} className="text-red-400 hover:bg-red-600 hover:text-primary transition-all">
            {deleteLabel}
          </SecondaryBtn>
        ) : <span />}
        <SecondaryBtn type="submit" className="px-5 font-bold bg-card-bg transition-all hover:bg-green-500/50">
          {submitLabel}
        </SecondaryBtn>
      </div>
    </form>
  );
}
