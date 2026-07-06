import { fetchSuggestions } from "../utils/data/data";
import SongsSection from "./ui/songsSection";

export default async function Dashboard() {
  const songs = await fetchSuggestions();
  return (
    <>
      <main className="no-scrollbar flex h-full w-full flex-col items-center gap-5 overflow-y-auto pt-22 pb-20">
        <SongsSection songs={songs} />
      </main>
    </>
  );
}
