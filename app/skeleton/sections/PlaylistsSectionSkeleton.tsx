import PlaylistCardSkeleton from "../components/PlaylistCard";

export default function PlaylistsSectionSkeleton() {
    return (
        <div className="no-scrollbar flex shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1">
            {Array.from({ length: 8 }).map((_, idx) => (
                <PlaylistCardSkeleton key={idx} />
            ))}
        </div>
    );
}

