import { ArtistInfo, ArtistBody } from "../sections/Artist";
import { fetchArtistInfo, fetchArtistBody } from "@/app/utils/data/data";

interface ArtistStreamProps {
        id: number;
}
export async function ArtistInfoStream({ id }: ArtistStreamProps) {
    const artist = await fetchArtistInfo(id);
    return (
        <>
        {artist && <ArtistInfo Artist={artist}/>}
        </>
    );
}

export async function ArtistBodyStream({ id }: ArtistStreamProps) {
    const songs = await fetchArtistBody(id);
    return (
        <>
        {songs && <ArtistBody Songs={songs.flat()}/>}
        </>
    );
}