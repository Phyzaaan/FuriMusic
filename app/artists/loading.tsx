import ArtistsSectionSkeleton from "../skeleton/sections/Artists";

export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <ArtistsSectionSkeleton carousel={false} />
        </main>
    );
}