import { Suspense } from "react";
import { fetchAllSongs } from "../../utils/data/data";
import SongsSection from "../sections/SongsSection";
import SongsSectionSkeleton from "../skeleton/SongsSkeleton";

export default async function SongsStream() {
    const songs = await fetchAllSongs();

    return (
        <Suspense fallback={<SongsSectionSkeleton />}>
            {songs ? <SongsSection songs={songs} /> : null}
        </Suspense>
    );
}