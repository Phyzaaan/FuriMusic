export default function ArtistCardSkeleton() {
    return (
        <div className="animate-pulse group hover:border-card-border flex w-48 flex-col items-center justify-center gap-2 rounded-lg shrink-0 snap-start border border-transparent p-2">
            <div className="relative w-40 aspect-square overflow-hidden rounded-full flex justify-end items-end">
                <div className="absolute inset-0 bg-card-bg/80" />
            </div>

            <div className="w-full px-1">
                <div className="h-5 w-24 rounded bg-card-bg mx-auto" />
                <div className="mt-2 h-4 w-20 rounded bg-card-bg/70 mx-auto" />
            </div>
        </div>
    );
}

