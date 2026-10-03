import ArtistsSectionSkeleton from "../skeleton/sections/Artists";

export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <div className="mb-4 flex items-center justify-between px-4">
                <div className="h-8 w-40 animate-pulse rounded bg-card-skelet" />
                <div className="h-6 w-16 animate-pulse rounded bg-card-skelet" />
            </div>
            <ArtistsSectionSkeleton carousel={false} />
        </main>
    );
}