import SongsCardSkeleton from "../components/songCard";

export default function SongsSectionSkeleton() {
    return (
        <div className="no-scrollbar mx-auto flex min-h-74 w-full max-w-[calc(100%-16px)] snap-x snap-mandatory gap-4 overflow-x-auto px-2 py-2">
            {Array.from({ length: 4 }).map((_, columnIndex) => (
                <div
                    key={columnIndex}
                    className="flex h-full w-[90%] min-w-[95%] snap-start flex-col gap-3 md:w-100 md:min-w-100"
                >
                    {Array.from({ length: 4 }).map((__, i) => (
                        <SongsCardSkeleton key={`${columnIndex}-${i}`} />
                    ))}
                </div>
            ))}
        </div>
    );
}

