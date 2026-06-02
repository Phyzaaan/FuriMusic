import { Suspense } from "react";
import { fetchTopSongs } from "../../utils/data/data";
import SongsSection from "../sections/songsSection";
import SongsSectionSkeleton from "@/app/skeleton/sections/SongsSectionSkeleton";

export default async function SongsStream() {
    const songs = await fetchTopSongs();

    return (
        <Suspense fallback={<SongsSectionSkeleton />}>
            {songs ? <SongsSection songs={songs} /> : null}
        </Suspense>
    );
}