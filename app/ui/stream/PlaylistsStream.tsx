import { fetchPlaylistsRange } from "../../utils/data/data";
import { PlaylistsSection } from "../sections/PlaylistsSection";

export default async function PlaylistsStream() {
    const playlists = await fetchPlaylistsRange(10, 0, undefined, true);

    return (
        <>
            {playlists && <PlaylistsSection Playlists={playlists} />}
        </>
    );
}


