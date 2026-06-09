import { fetchPlaylistsRange } from "../../utils/data/data";
import { PlaylistsSection as PlaylistsInlineSection } from "@/app/ui/sections/PlaylistsSection";
import PlaylistsSection from "../section/Playlist";

export default async function PlaylistsStream({ currentType, query }: { currentType: string; query: string }) {
    const playlists = await fetchPlaylistsRange(100, 0, query);
    return (
        <>
            {(currentType === "all") && <PlaylistsInlineSection Playlists={playlists} />}
            {(currentType === "playlists") && <PlaylistsSection Playlists={playlists} />}
        </>
    );
}


