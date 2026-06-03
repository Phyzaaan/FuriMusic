import { fetchArtistsRange } from "../../utils/data/data";
import ArtistsSection from "../sections/ArtistSection";

export default async function ArtistsStream() {
    const artists = await fetchArtistsRange();

    return (
        <>
            {artists && <ArtistsSection artists={artists} />}
        </>
    );
}


