import { fetchSongsRange } from "../../utils/data/data";
import SongsSection from "../sections/songsSection";

export default async function SongsStream() {
    const songs = await fetchSongsRange(16, 0, undefined, true);

    return (
        <>
            {<SongsSection Songs={songs} />}
        </>
    );
}