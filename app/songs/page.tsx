import { fetchSongsRange } from "@/app/utils/data/data";
import SongsSection from "./section/song";
import ErrorMsg from "@/app/ui/components/Error";

export default async function SongsPage() {
    const songs = await fetchSongsRange(25);
    if (!songs || songs.length === 0) return <ErrorMsg>404 NO Artist Found</ErrorMsg>;

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <div className="my-2 flex w-full items-center justify-between px-2 py-1">
                <h1 className="text-3xl font-semibold">Songs Page</h1>
            </div>
            <SongsSection Songs={songs} />
        </main>
    );
}
