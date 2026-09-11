import ArtistsSectionSkeleton from "@/app/skeleton/sections/Artists";
import PlaylistsSectionSkeleton from "@/app/skeleton/sections/Playlists";
import SongsSectionSkeleton from "@/app/skeleton/sections/Songs";

export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col gap-4 overflow-y-auto pb-20 pt-22">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-4">
                <div className="h-10 w-full animate-pulse rounded-lg bg-card-skelet" />
                <div className="flex w-full justify-center gap-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 w-20 animate-pulse rounded-md bg-card-skelet"
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-6 px-2">
                <div className="space-y-3">
                    <div className="h-7 w-40 animate-pulse rounded bg-card-skelet" />
                    <PlaylistsSectionSkeleton carousel={false} />
                </div>

                <div className="space-y-3">
                    <div className="h-7 w-40 animate-pulse rounded bg-card-skelet" />
                    <SongsSectionSkeleton carousel={false} />
                </div>

                <div className="space-y-3">
                    <div className="h-7 w-40 animate-pulse rounded bg-card-skelet" />
                    <ArtistsSectionSkeleton />
                </div>
            </div>
        </main>
    );
}
