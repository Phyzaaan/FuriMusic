import ArtistCardSkeleton from "../components/artistCard";

export default function ArtistsSectionSkeleton() {
    return (
        <div className="no-scrollbar flex shrink-0 max-w-[calc(100%-16px)] mx-auto snap-x snap-mandatory gap-2 overflow-x-auto px-2 py-1">
            {Array.from({ length: 10 }).map((_, idx) => (
                <ArtistCardSkeleton key={idx} />
            ))}
        </div>
    );
}

