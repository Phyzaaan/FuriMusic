import { fetchTopArtists } from "../../utils/data/data";
import ArtistsSection from "../sections/ArtistSection";

export default async function ArtistsStream() {
    const artists = await fetchTopArtists();

    return (
        <>
            {artists && <ArtistsSection artists={artists} />}
        </>
    );
}


