import { Suspense } from "react";
import { fetchAllArtists } from "../../utils/data/data";
import ArtistsSection from "@/app/ui/sections/ArtistSection";
import ArtistsSectionSkeleton from "../skeleton/ArtistsSkeleton";

export default async function ArtistsStream() {
    const artists = await fetchAllArtists();

    return (
        <Suspense fallback={<ArtistsSectionSkeleton />}>
            {artists ? <ArtistsSection artists={artists} /> : null}
        </Suspense>
    );
}