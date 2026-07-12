"use client";
import SongsCard from "@/app/ui/components/Songcard";
import SongEditor from "./songEditor";
import UploadSongEditor from "@/app/ui/components/editor/UploadSongEditor";
import { useState } from "react";
import { SecondaryBtn } from "@/app/ui/components/Buttons";
import type { suggestionSong } from "@/app/utils/data/type";

type props = {
    songs: suggestionSong[];
}

export default function SongsSection({ songs }: props) {
    const [showEditor, setShowEditor] = useState(false);
    const [showAddEditor, setShowAddEditor] = useState(false);
    const [song, setSong] = useState<suggestionSong | null>(null);

    const handleEdit = (id: number) => {
        const currSong = songs.find((song) => song.id === id);
        if (!currSong) return;
        setSong(currSong);
        setShowEditor(true);
        console.log("Editing song:", currSong);
    }

    return (
        <>
            <div className="w-full flex items-center justify-between px-2">
                <h1 className="text-3xl font-bold">Suggestions</h1>
                <SecondaryBtn type="button" onClick={() => setShowAddEditor(true)}>
                    Add Song
                </SecondaryBtn>
            </div>
            <div className="no-scrollbar flex flex-col items-center justify-center w-full gap-2 flex-wrap px-2 py-1">
                {songs && songs.map((songItem) => {
                    let artists = songItem.pendingArtists.map(artist => ({id: Math.floor(Math.random() * 100), name: artist.name}));
                    artists = {...artists, ...songItem.artists}
                    return (
                        <SongsCard
                            key={songItem.id}
                            id={songItem.id}
                            banner={songItem.banner}
                            name={songItem.name}
                            url={songItem.url}
                            duration={songItem.duration}
                            artists={artists}
                            onClick={handleEdit}
                        />
                    )
                })}
            </div>
            {(showEditor && song) &&
                <SongEditor Song={song} showEditor={showEditor} setShowEditor={setShowEditor} source="suggestions" />
            }
            {showAddEditor ? (
                <UploadSongEditor showEditor={showAddEditor} setShowEditor={setShowAddEditor} />
            ) : null}
        </>
    )
}