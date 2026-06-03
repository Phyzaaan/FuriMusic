import { fetchAllPlaylists } from "../../utils/data/data";
import PlaylistsSection from "../sections/Playlists";

export default async function PlaylistsStream() {
    const playlists = await fetchAllPlaylists();

    return (
        <>
            {playlists && <PlaylistsSection Playlists={playlists} />}
        </>
    );
}