import { Suspense } from "react";
import { fetchTopArtists } from "../../utils/data/data";
import ArtistsSection from "../sections/ArtistSection";
import ArtistsSectionSkeleton from "@/app/skeleton/sections/ArtistsSectionSkeleton";

export default async function ArtistsStream() {
    const artists = await fetchTopArtists();

    return (
        <Suspense fallback={<ArtistsSectionSkeleton />}>
            {artists ? <ArtistsSection artists={artists} /> : null}
        </Suspense>
    );
}


