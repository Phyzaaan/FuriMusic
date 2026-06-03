import { fetchPlaylistsRange } from "../../utils/data/data";
import { PlaylistsSection } from "../sections/PlaylistsSection";

export default async function PlaylistsStream() {
    const playlists = await fetchPlaylistsRange();

    return (
        <>
            {playlists && <PlaylistsSection Playlists={playlists} />}
        </>
    );
}


