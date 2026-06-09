import { fetchArtistsRange } from "../../utils/data/data";
import ArtistsSection from "@/app/ui/sections/ArtistSection";
import AllArtistsSection from "../section/Artists";

export default async function ArtistsStream({ currentType, query }: { currentType: string; query: string }) {
    const artists = await fetchArtistsRange(100, 0, query);
    return (
        <>
            {(currentType === "all") && <ArtistsSection Artists={artists} />}
            {(currentType === "artists") && <AllArtistsSection Artists={artists} />}
        </>
    );
}