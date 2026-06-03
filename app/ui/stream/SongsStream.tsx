import { fetchTopSongs } from "../../utils/data/data";
import SongsSection from "../sections/songsSection";

export default async function SongsStream() {
    const songs = await fetchTopSongs();

    return (
        <>
            {songs && <SongsSection songs={songs} />}
        </>
    );
}