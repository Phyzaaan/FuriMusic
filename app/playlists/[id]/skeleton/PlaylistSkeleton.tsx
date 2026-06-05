import SongsCardSkeleton from "@/app/skeleton/components/songCard";

export function PlaylistInfoSkeleton() {
    return (
        <div className="animate-pulse no-scrollbar flex items-center w-full gap-4 px-4 py-2">
            <div className="w-52 h-52 aspect-square rounded-md bg-card-skelet" />
            <div className="py-4 h-full w-full flex flex-col gap-4 items-start">
                <div>
                <div className="w-56 h-8 bg-card-skelet" />
                <div className="w-32 h-5 bg-card-skelet/70" />
                </div>
                <div className="w-24 h-6 bg-card-skelet rounded-md" />
            </div>
        </div>
    );
}

export function PlaylistBodySkeleton() {
    return (
        <div className="no-scrollbar flex w-full flex-col gap-2 px-6 py-4 overflow-y-auto">
            {Array.from({ length: 10 }).map((__, i) => (
                <SongsCardSkeleton key={i} />
            ))}
        </div>
    );
}

