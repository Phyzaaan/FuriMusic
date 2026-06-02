import PlaylistCardSkeleton from "@/app/skeleton/components/PlaylistCard";

export default function PlaylistsSectionSkeleton() {
    return (
        <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
            {Array.from({ length: 10 }).map((_, idx) => (
                <PlaylistCardSkeleton key={idx} />
            ))}
        </div>
    );
}

