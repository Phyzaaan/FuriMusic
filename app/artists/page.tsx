import { fetchArtistsRange } from "@/app/utils/data/data";
import ArtistsSection from "./section/artist";
import ErrorMsg from "@/app/ui/components/Error";

export default async function ArtistsPage() {
    const artists = await fetchArtistsRange(25);
    if (!artists || artists.length === 0) return <ErrorMsg>404 NO Artist Found</ErrorMsg>;

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <div className="my-2 flex w-full items-center justify-between px-2 py-1">
                <h1 className="text-3xl font-semibold">Artists Page</h1>
            </div>
            <ArtistsSection Artists={artists} />
        </main>
    );
}
