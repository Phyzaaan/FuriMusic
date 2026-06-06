import dynamic from "next/dynamic";
import { Suspense } from "react";
import SongsSectionSkeleton from "../skeleton/sections/Songs";
import ArtistsSectionSkeleton from "../skeleton/sections/Artists";
import PlaylistsSectionSkeleton from "../skeleton/sections/Playlists";
const PlaylistsStream = dynamic(() => import("./stream/PlaylistsStream"));
const ArtistsStream = dynamic(() => import("./stream/ArtistsStream"));
const SongsStream = dynamic(() => import("./stream/SongsStream"));
import { SearchFilters } from "../ui/components/SearchFilter";

interface Props {
    searchParams: Promise<{ type?: string; query?: string }>;
}

function sanatizeQuery(query: string) {
    return query.replace(/\+/g, " ")       // Turn '+' into spaces
        .replace(/[^a-zA-Z0-9\s]/g, "")    // Remove all special characters
        .replace(/\s+/g, " ")              // Collapse multiple spaces into one
        .trim();                           // Remove leading/trailing spaces
}
export default async function Home({ searchParams }: Props) {
    const { type = "all", query = "" } = await searchParams;
    const sanatizedQuery = sanatizeQuery(query);
    return (
        <main className={`flex w-full h-full flex-col no-scrollbar pt-22 pb-20 ${!sanatizedQuery ? 'items-center justify-center' : 'overflow-y-auto'}`}>
            {!sanatizedQuery ? (
                <h1 className="text-3xl">You cant just search <span className="italic">Nothing</span>, Baka!</h1>
            ) : (
                <>
                    <SearchFilters currentType={type} query={query} />
                    <Suspense fallback={<PlaylistsSectionSkeleton />}>
                        <PlaylistsStream currentType={type} query={sanatizedQuery} />
                    </Suspense>
                    <Suspense fallback={<SongsSectionSkeleton />}>
                        <SongsStream currentType={type} query={sanatizedQuery} />
                    </Suspense>
                    <Suspense fallback={<ArtistsSectionSkeleton />}>
                        <ArtistsStream currentType={type} query={sanatizedQuery} />
                    </Suspense>
                </>
            )}
        </main>
    );
}

