import { fetchArtistsRange } from "../../utils/data/data";
import ArtistsSection from "../sections/Artists";

export default async function ArtistsStream() {
    const artists = await fetchArtistsRange();

    return (
        <>
        { artists && <ArtistsSection Artists={artists} />}
        </>
    );
}