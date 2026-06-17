import { fetchSongsRange } from "../../utils/data/data";
import SongsSection from "@/app/ui/sections/SongsSection";
import AllSongsSection from "../section/Songs";

export default async function SongsStream({ currentType, query }: { currentType: string; query: string }) {
    const songs = await fetchSongsRange(100, 0, query);
    return (
        <>
            {(currentType === "all") && <SongsSection Songs={songs} />}
            {(currentType === "songs") && <AllSongsSection Songs={songs} />}
        </>
    );
}