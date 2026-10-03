import { fetchSongsRange } from "@/app/utils/data/data";
import SongsSection from "./section/song";
import ErrorMsg from "@/app/ui/components/Error";
import PlaylistFilters from "@/app/ui/components/Fiter";
import { parseSort } from "@/app/utils/libs/sort";

export default async function SongsPage({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string }>;
}) {
    const sort = parseSort((await searchParams).sort, "songs");
    const songs = await fetchSongsRange(25, 0, undefined, false, sort);
    if (!songs || songs.length === 0) return <ErrorMsg>404 NO Songs Found</ErrorMsg>;

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <div className="flex w-full items-center justify-between gap-3 px-2 py-1">
                <h1 className="text-3xl font-semibold">Songs Page</h1>
                <PlaylistFilters current={sort} target="songs" />
            </div>
            <SongsSection key={sort}  Songs={songs} sort={sort} />
        </main>
    );
}
