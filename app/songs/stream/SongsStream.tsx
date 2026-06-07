import { fetchSongsRange } from "../../utils/data/data";
import SongsSection from "../sections/SongsSection";

export default async function SongsStream() {
    const songs = await fetchSongsRange();

    return (
        <>
            {songs && <SongsSection Songs={songs} />}
        </>
    );
}