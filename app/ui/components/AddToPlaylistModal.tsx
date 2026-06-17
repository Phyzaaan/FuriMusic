"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { fetchPlaylistsRange, toggleSongInPlaylist, songInPlaylists } from "@/app/utils/data/data";
import { Playlist } from "@/app/utils/data/type";

import PlaylistEditor from "@/app/playlists/sections/editor";

import { PrimaryBtn, SecondaryBtn } from "./Buttons";

type Props = {
  show: boolean;
  setShow: (val: boolean) => void;
  songId: number;
};

function AddToPlaylistModal({ show, setShow, songId }: Props) {
  const [query, setQuery] = useState("");

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songPlaylistsIds, setSongPlaylistsIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  const [showPlaylistEditor, setShowPlaylistEditor] = useState(false);

  const close = () => {
    setShow(false);
    setQuery("");
    setSongPlaylistsIds([]);
    setShowPlaylistEditor(false);
  };

  const loadPlaylists = async (q: string) => {
    setLoading(true);
    const pls = (await fetchPlaylistsRange(12, 0, q)) ?? [];
    setPlaylists(pls);

    setLoading(false);
  };

  const toggle = async (playlistId: number) => {
    setToggling(true);
    const res = await toggleSongInPlaylist({ songId, playlistId });
    if (!res) {
      setToggling(false);
      return;
    };

    if (res.added) {
      setSongPlaylistsIds(prev => [...prev, playlistId]);
    } else {
      setSongPlaylistsIds(prev => prev.filter(id => id !== playlistId));
    }
    setToggling(false);
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      await loadPlaylists("");
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    async function fetchSongPlaylists() {
      const songPlaylists = await songInPlaylists(songId);
      setSongPlaylistsIds(songPlaylists?.map(id => id) ?? []);
    }
    fetchSongPlaylists();
  }, [songId])

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center" role="dialog" aria-modal>
      <div className="w-full max-w-md mx-2 mb-4 rounded-lg border border-card-border bg-dark-bg/50 backdrop-blur-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-2 border-b border-card-border bg-dark-bg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={`/icons/playlist_add.svg`} alt="Add to playlist" width={24} height={24} />
            <h2 className="text-xl font-semibold">Add to playlist</h2>
          </div>

          <PrimaryBtn onClick={close} icon="/icons/close.svg" width={24} height={24} className="lg:hidden" />
          <PrimaryBtn onClick={close} icon="/icons/close.svg" width={24} height={24} className="hidden lg:block" />
        </div>

        {/* Search */}
        <div className="px-2 py-1 border-b border-card-border">
          <div className="flex items-center gap-2">
            <input
              type="search"
              value={query}
              placeholder="Search playlists..."
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-dark-bg border-card-border rounded-md border px-2 py-1 text-lg outline-none focus:ring-1 focus:ring-accent-from"
            />
            <SecondaryBtn
              type="button"
              onClick={() => {
                loadPlaylists(query);
              }}
              disabled={loading}
              className="whitespace-nowrap min-w-25 bg-card-bg py-2 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching
                </span>
              ) : (
                "Search"
              )}
            </SecondaryBtn>
          </div>
        </div>

        {/* List */}
        <div className="no-scrollbar flex flex-col gap-1 max-h-[60vh] overflow-y-auto px-2 py-3">
          {loading && <div className="px-3 text-secondary">Loading playlists...</div>}

          {!loading && playlists.length === 0 && <div className="px-3 text-secondary">No playlists found.</div>}

          {!loading &&
            playlists.map((pl) => {
              const inSet = songPlaylistsIds?.includes(pl.id) ?? false;

              return (
                <button
                  key={pl.id}
                  onClick={() => toggle(pl.id)}
                  disabled={toggling}
                  className={`w-full flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition-all duration-150 hover:border-card-border ${inSet ? "border-card-border bg-dark-bg" : "border-transparent"} ${toggling ? "bg-gray-700/50" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-card-border shrink-0">
                      <Image src={pl.banner} alt={pl.name} fill sizes={"42"} className="object-cover" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="truncate font-medium">{pl.name}</div>
                      <div className="text-secondary text-sm">{pl.totalSongs} songs</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Image
                      src={inSet ? "/icons/playlist_remove.svg" : "/icons/playlist_add.svg"}
                      alt={inSet ? "Remove" : "Add"}
                      width={32}
                      height={32}
                    />
                  </div>
                </button>
              );
            })}
        </div>

        {/* Create Playlist */}
        <div className="px-4 py-3 border-t border-card-border bg-dark-bg flex items-center justify-center">
          <SecondaryBtn
            type="button"
            icon="/icons/add.svg"
            className="w-full justify-center"
            onClick={() => setShowPlaylistEditor(true)}
          >
            Create Playlist
          </SecondaryBtn>
        </div>

      </div>
      {/* Embedded Playlist Editor (Create) */}
      {showPlaylistEditor && (
        <PlaylistEditor
          showEditor={showPlaylistEditor}
          setShowEditor={setShowPlaylistEditor}
        />
      )}
    </div>

  );
}

export default AddToPlaylistModal;

