import { fetchSuggestions } from "../utils/data/data"
import SongsSection from "./ui/songsSection";

export default async function Dashboard() {
    const songs = await fetchSuggestions();
    return (
        <main className="no-scrollbar flex h-full w-full flex-col items-center gap-5 overflow-y-auto pt-22 pb-20">
            <h1 className="text-3xl font-bold">Suggestions</h1>
            <SongsSection songs={songs} />
        </main>
    )
}