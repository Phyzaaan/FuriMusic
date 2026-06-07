import { fetchPlaylistsRange } from "../../utils/data/data";
import PlaylistsSection from "../sections/Playlists";

export default async function PlaylistsStream() {
    const playlists = await fetchPlaylistsRange(100);

    return (
        <>
            {playlists && <PlaylistsSection Playlists={playlists} />}
        </>
    );
}