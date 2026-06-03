import { fetchAllArtists } from "../../utils/data/data";
import ArtistsSection from "../sections/Artists";

export default async function ArtistsStream() {
    const artists = await fetchAllArtists();

    return (
        <>
        { artists && <ArtistsSection Artists={artists} />}
        </>
    );
}