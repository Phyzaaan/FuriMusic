import { Suspense } from "react";
import { fetchAllPlaylists } from "../../utils/data/data";
import PlaylistsSection from "../sections/Playlists";
import PlaylistsSectionSkeleton from "../skeleton/PlaylistsSkeleton";

export default async function PlaylistsStream() {
    const playlists = await fetchAllPlaylists();

    return (
        <Suspense fallback={<PlaylistsSectionSkeleton />}>
            {playlists ? <PlaylistsSection Playlists={playlists} /> : null}
        </Suspense>
    );
}