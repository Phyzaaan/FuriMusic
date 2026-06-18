import { fetchPlaylistsRange } from "@/app/utils/data/data";
import PlaylistsSection from "../sections/Playlists";
import ErrorMsg from "@/app/ui/components/Error";

export default async function PlaylistsStream() {
    const playlists = await fetchPlaylistsRange(25);
    if (!playlists || playlists.length === 0) return <ErrorMsg>404 NO Playlist Found</ErrorMsg>;
    return (
        <PlaylistsSection Playlists={playlists} />
    );
}