import ArtistCardSkeleton from "@/app/skeleton/components/artistCard";

export default function ArtistsSectionSkeleton() {
    return (
        <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
            {Array.from({ length: 10 }).map((_, idx) => (
                <ArtistCardSkeleton key={idx} />
            ))}
        </div>
    );
}

