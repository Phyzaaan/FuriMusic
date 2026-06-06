import { fetchPlaylistsRange } from "../../utils/data/data";
import { PlaylistsSection } from "@/app/ui/sections/PlaylistsSection";
import AllPlaylistsSection from "../section/Playlists";

export default async function PlaylistsStream({ currentType, query }: { currentType: string; query: string }) {
    const playlists = await fetchPlaylistsRange(100, 0, query); 
    return (
        <>
            {(playlists && currentType === "all") && <PlaylistsSection Playlists={playlists} />}
            {(playlists && currentType === "playlists") && <AllPlaylistsSection Playlists={playlists} />}
        </>
    );
}


