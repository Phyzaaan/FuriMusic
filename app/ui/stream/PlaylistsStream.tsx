import { fetchTopPlaylists } from "../../utils/data/data";
import { PlaylistsSection } from "../sections/PlaylistsSection";

export default async function PlaylistsStream() {
    const playlists = await fetchTopPlaylists();

    return (
        <>
            {playlists && <PlaylistsSection Playlists={playlists} />}
        </>
    );
}


