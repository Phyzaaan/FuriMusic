import { PlaylistInfo, PlaylistBody } from "../sections/Playlist";
import { fetchPlaylistInfo, fetchPlaylistBody } from "@/app/utils/data/data";

interface PlaylistStreamProps {
    id: number;
}

export async function PlaylistInfoStream({ id }: PlaylistStreamProps) {
    const playlist = await fetchPlaylistInfo(id);
    return (
        <>
            {playlist && <PlaylistInfo Playlist={playlist} />}
        </>
    );
}

export async function PlaylistBodyStream({ id }: PlaylistStreamProps) {
    const songs = await fetchPlaylistBody(id);
    return (
        <>
            {songs && <PlaylistBody Songs={songs.flat()} />}
        </>
    );
}

