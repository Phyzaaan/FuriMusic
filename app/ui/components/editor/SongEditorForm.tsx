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
    console.log("Handle form submission");
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
    <form onSubmit={handleSubmit(submitForm)} onKeyDown={handleFormKeyDown} className="flex-1 overflow-y-auto px-2 py-1 pb-14 md:pb-1 flex flex-col gap-2 no-scrollbar">
      <div className="flex flex-col w-full gap-2 py-1">
        <label className="text-sm font-medium text-secondary">Song Banner</label>
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
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleBannerChange(event.target.files?.[0] ?? null, true)}
            className="bg-dark-bg border-card-border w-full rounded-md border py-1 text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-btn file:text-primary hover:file:bg-opacity-80 transition-all cursor-pointer"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-secondary">Song Name</label>
        <input
          type="text"
          {...register("name")}
          placeholder="Song name..."
          className="bg-dark-bg border-card-border w-full text-lg rounded-md border px-2 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
        />
      </div>

      <div className="flex flex-col gap-1 pb-1">
        <label className="text-sm font-semibold text-tertiary">Selected Artists ({selectedArtists.length})</label>
        <div className="flex gap-2 max-h-45 flex-wrap overflow-y-auto no-scrollbar shrink-0 px-2 py-2 border border-card-border rounded-md bg-dark-bg">
          {selectedArtists.length > 0 ? (
            selectedArtists.map((artist) => (
              <button
                key={artist.id}
                type="button"
                onClick={() => toggleArtist(artist.id)}
                className="rounded-lg px-2 py-1 text-xs border bg-card-bg border-card-border text-secondary hover:border-card-border hover:text-primary hover:bg-red-500/30 cursor-pointer transition-all duration-100"
              >
                {artist.name}
              </button>
            ))
          ) : (
            <span>No artists selected</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 pb-1">
        <label className="text-sm font-semibold text-tertiary">Add More Artists</label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={artistsFilter}
              onChange={(event) => setArtistsFilter(event.target.value)}
              placeholder="Search artists..."
              className="bg-dark-bg border-card-border grow rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
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

          <div className="w-full max-h-34 p-2 border border-card-border rounded-lg bg-dark-bg overflow-y-auto no-scrollbar">
            {artistsResults.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {artistsResults.map((artist) => {
                  const selected = selectedArtistIds.includes(artist.id);
                  return (
                    <button
                      key={artist.id}
                      type="button"
                      onClick={() => toggleArtist(artist.id)}
                      className={`rounded-lg px-2 py-1 text-xs border transition-all duration-200 cursor-pointer ${selected ? "bg-dark-bg border-card-border shadow-lg hover:bg-red-500/30" : "bg-card-bg border-transparent text-secondary hover:border-card-border hover:text-primary"}`}
                    >
                      {artist.name}
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

      <div className="relative w-full">
        {createOpen ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 px-3 py-4 backdrop-blur-sm">
            <div className="flex max-h-[min(80vh,42rem)] w-full max-w-lg flex-col gap-2 overflow-y-auto rounded-2xl border border-card-border bg-dark-bg/95 px-4 py-4 shadow-2xl shadow-black/50 backdrop-blur-xl no-scrollbar">
              <div className="flex flex-col gap-1 pb-1">
                <label className="text-sm font-medium text-secondary">Artist Banner</label>
                {artistBannerPreview ? (
                  <div className="relative">
                    <Image src={artistBannerPreview} alt="Artist banner preview" width={360} height={360} className="w-full aspect-square rounded-lg object-cover border border-card-border" />
                    <SecondaryBtn
                      type="button"
                      onClick={() => {
                        setNewArtistBanner(null);
                        setArtistBannerPreview("");
                      }}
                      className="absolute bottom-2 right-2 bg-dark-bg/80"
                    >
                      Remove
                    </SecondaryBtn>
                  </div>
                ) : (<input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleBannerChange(event.target.files?.[0] ?? null, false)}
                  className="border-card-border bg-dark-bg w-full rounded-md border py-1 text-sm file:mx-auto file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-btn file:text-primary hover:file:bg-opacity-80 transition-all cursor-pointer"
                />)}
              </div>

              <div className="flex flex-col gap-1 pb-1">
                <label className="text-sm font-medium text-secondary">Artist Name</label>
                <input
                  type="text"
                  value={newArtistName}
                  onChange={(event) => setNewArtistName(event.target.value)}
                  placeholder="New artist name"
                  className="bg-dark-bg border-card-border w-full rounded-md border px-2 py-1 text-primary focus:outline-none focus:ring-1 focus:ring-accent-from transition-all"
                />
              </div>
              <div className="flex justify-between gap-2">
                <SecondaryBtn type="button" onClick={() => void handleCreateLocalArtist()} className="hover:bg-green-500/50">
                  Create
                </SecondaryBtn>
                <SecondaryBtn type="button" onClick={() => setCreateOpen(false)} className="hover:bg-transparent border-transparent hover:text-red-400">
                  Cancel
                </SecondaryBtn>
              </div>
            </div>
          </div>
        ) : (
          <SecondaryBtn type="button" onClick={() => setCreateOpen(true)} className="bg-card-bg px-2">
            Create Artist
          </SecondaryBtn>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-secondary">Lyrics</label>
        <textarea
          {...register("lyrics")}
          placeholder="No Lyrics yet..."
          className="bg-dark-bg border-card-border flex w-full min-h-40 shrink-0 rounded-md border px-2 py-1"
        />
      </div>

      {children}

      <div className="flex items-center justify-between gap-2 rounded-md border border-card-border bg-card-bg/90 px-2 py-3 backdrop-blur-sm">
        {!hideDelete ? (
          <SecondaryBtn type="button" onClick={() => void onDelete?.()} className="text-red-400 hover:bg-red-600 hover:text-primary transition-all">
            {deleteLabel}
          </SecondaryBtn>
        ) : <span />}
        <SecondaryBtn type="submit" onClick={() => console.log("Submit clicked")} className="font-bold transition-all hover:bg-green-500/50">
          {submitLabel}
        </SecondaryBtn>
      </div>
    </form>
  );
}
