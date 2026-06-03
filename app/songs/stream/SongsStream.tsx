import { fetchAllSongs } from "../../utils/data/data";
import SongsSection from "../sections/SongsSection";

export default async function SongsStream() {
    const songs = await fetchAllSongs();

    return (
        <>
            {songs && <SongsSection songs={songs} />}
        </>
    );
}