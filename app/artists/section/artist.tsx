"use client";
import ArtistCard from "@/app/ui/components/ArtistCard";
import { fetchArtistsRange } from "@/app/utils/data/data";
import { useState } from "react";
import { Artist } from "@/app/utils/data/type";
import { SecondaryBtn } from "@/app/ui/components/Buttons";

interface ArtistsProps {
    Artists: Artist[];
}

function ArtistsSection({ Artists }: ArtistsProps) {
    const [artists, setArtists] = useState<Artist[]>(Artists);
    const [loading, setLoading] = useState(false);

    const [offset, setOffset] = useState(25);
    const [hasMore, setHasMore] = useState(Artists.length === 25);

    const loadMore = async () => {
        setLoading(true);
        const newArtists = await fetchArtistsRange(25, offset);
        if (newArtists) {
            setArtists([...artists, ...newArtists]);
            setOffset(offset + 25);
            if (newArtists?.length < 25) setHasMore(Artists.length < 25);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
                {artists && artists.map(({ id, banner, name }) => {
                    return (
                        <ArtistCard key={id} id={id} banner={banner} name={name} />
                    );
                })}
            </div>
            {hasMore && (
                <SecondaryBtn
                onClick={() => loadMore()}
                disabled={loading}
                >{loading ? "Loading..." : "Load More"}</SecondaryBtn>
            )}
        </>
    );
}

export default ArtistsSection;
