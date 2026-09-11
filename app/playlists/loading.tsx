import PlaylistsSectionSkeleton from "@/app/skeleton/sections/Playlists";

export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pb-20 pt-22">
            <div className="mb-4 flex items-center justify-between px-4">
                <div className="h-8 w-40 animate-pulse rounded bg-card-skelet" />
                <div className="h-10 w-28 animate-pulse rounded-md bg-card-skelet" />
            </div>

            <PlaylistsSectionSkeleton carousel={false} />
        </main>
    );
}
