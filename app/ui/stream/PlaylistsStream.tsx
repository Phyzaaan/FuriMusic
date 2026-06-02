import { Suspense } from "react";
import { fetchTopPlaylists } from "../../utils/data/data";
import { PlaylistsSection } from "../sections/PlaylistsSection";
import PlaylistsSectionSkeleton from "@/app/skeleton/sections/PlaylistsSectionSkeleton";

export default async function PlaylistsStream() {
    const playlists = await fetchTopPlaylists();

    return (
        <Suspense fallback={<PlaylistsSectionSkeleton />}>
            {playlists && <PlaylistsSection Playlists={playlists} />}
        </Suspense>
    );
}


