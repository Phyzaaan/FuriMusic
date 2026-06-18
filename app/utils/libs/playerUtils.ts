import { Song } from "../data/type";

export async function prewarmTrack(song: Song): Promise<string | null> {
    if (song.blobUrl || !song.url) return song.blobUrl || null;

    try {
        const response = await fetch(song.url);
        if (!response.ok) throw new Error("Network response was not ok");

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error(`Failed to prewarm song: ${song.name}`, error);
        return null;
    }
}