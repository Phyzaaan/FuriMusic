import { fetchArtistsRange } from "@/app/utils/data/data";
import ArtistsSection from "./section/artist";
import ErrorMsg from "@/app/ui/components/Error";
import PlaylistFilters from "@/app/ui/components/Fiter";
import { parseSort } from "@/app/utils/libs/sort";

export default async function ArtistsPage({
    searchParams,
}: {
    searchParams: Promise<{ sort?: string }>;
}) {
    const sort = parseSort((await searchParams).sort, "artists");
    const artists = await fetchArtistsRange(25, 0, undefined, false, sort);
    if (!artists || artists.length === 0) return <ErrorMsg>404 NO Artist Found</ErrorMsg>;

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <div className="flex w-full items-center justify-between gap-3 px-2 py-1">
                <h1 className="text-3xl font-semibold">Artists Page</h1>
                <PlaylistFilters current={sort} target="artists" />
            </div>
            <ArtistsSection key={sort}  Artists={artists} sort={sort} />
        </main>
    );
}
