import PlaylistCardSkeleton from "../components/PlaylistCard";

export default function PlaylistsSectionSkeleton() {
    return (
        <>
            <div className="mt-4 flex w-full items-center justify-between px-2 py-1">
                <h1 className="text-3xl font-semibold">Playlists</h1>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-md bg-card-skelet"/>
                    <div className="w-10 h-10 rounded-md bg-card-skelet"/>
                    <div className="w-16 h-8 rounded-md bg-card-skelet">
                    
                    </div>
                </div>
            </div>
            <div
                className="no-scrollbar flex shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1"
            >
                {Array.from({ length: 8 }).map((_, idx) => (
                    <PlaylistCardSkeleton key={idx} />
                ))}
            </div>
        </>
    );
}

