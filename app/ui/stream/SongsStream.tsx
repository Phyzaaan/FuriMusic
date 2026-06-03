import { fetchSongsRange } from "../../utils/data/data";
import SongsSection from "../sections/songsSection";

export default async function SongsStream() {
    const songs = await fetchSongsRange();

    return (
        <>
            {songs && <SongsSection songs={songs} />}
        </>
    );
}