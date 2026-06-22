"use client";
import SongsCard from "@/app/ui/components/Songcard";
import SongEditor from "./songEditor";
import { useState } from "react";
import { song } from "@/app/utils/data/type";

type props = {
    songs: song[];
}

export default function SongsSection({ songs }: props) {
    const [showEditor, setShowEditor] = useState(false);
    const [song, setSong] = useState<song>();

    const handleEdit = (id: number) => {
        const currSong = songs.find((song) => song.id === id);
        if (!currSong) return;
        setSong(currSong);
        setShowEditor(true);
    }

    return (
        <>
            <div className="no-scrollbar flex flex-col items-center justify-center w-full gap-2 flex-wrap px-2 py-1">
                {songs && songs.map((song) => {
                    const artist = [{ id: song.id, name: song.artists[0].name }]
                    return (
                        <SongsCard
                            key={song.id}
                            id={song.id}
                            banner={song.banner}
                            name={song.name}
                            url={song.url}
                            duration={song.duration}
                            artists={artist}
                            onClick={handleEdit}
                        />
                    )
                })}
            </div>
            {(showEditor && song) &&
                <SongEditor Song={song} showEditor={showEditor} setShowEditor={setShowEditor} />
            }
        </>
    )
}