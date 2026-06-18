"use client";
import SongsCard from "@/app/ui/components/Songcard";
import { fetchSongsRange } from "@/app/utils/data/data";
import { useState } from "react";
import { Song } from "@/app/utils/data/type";
import { SecondaryBtn } from "@/app/ui/components/Buttons";

interface SongsProps {
    Songs: Song[];
}

function SongsSection({ Songs }: SongsProps) {
    const [songs, setSongs] = useState<Song[]>(Songs);
    const [loading, setLoading] = useState(false);

    const [offset, setOffset] = useState(25);
    const [hasMore, setHasMore] = useState(Songs.length === 25);

    const loadMore = async () => {
        setLoading(true);
        const newSongs = await fetchSongsRange(25, offset);
        if (newSongs) {
            setSongs([...songs, ...newSongs]);
            setOffset(offset + 25);
            if (newSongs?.length < 25) setHasMore(false);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="no-scrollbar flex flex-col items-center justify-center w-full gap-2 flex-wrap px-2 py-1">
                {songs && songs.map(({ id, banner, name, url, duration, artists }) => {
                    return (
                        <SongsCard key={id} id={id} banner={banner} name={name} url={url} duration={duration} artists={artists} />
                    );
                })}
            </div>
            {hasMore && (
                <div className="w-full flex justify-center py-2">
                    <SecondaryBtn
                        onClick={() => loadMore()}
                        disabled={loading}
                        className="w-[calc(100%-32px)]"
                    >{loading ? "Loading..." : "Load More"}</SecondaryBtn>
                </div>
            )}
        </>
    );
}

export default SongsSection;
