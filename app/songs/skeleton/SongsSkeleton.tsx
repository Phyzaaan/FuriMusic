import SongsCardSkeleton from "@/app/skeleton/components/songCard";

export default function SongsSectionSkeleton() {
    return (
        <div className="no-scrollbar flex w-full flex-col gap-2 px-2 py-1">
            {Array.from({ length: 10 }).map((__, i) => (
                <SongsCardSkeleton key={i} />
            ))}
        </div>
    );
}

