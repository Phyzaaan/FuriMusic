import SongsCardSkeleton from "../components/songCard";

export default function SongsSectionSkeleton() {
    return (
        <>
            <div className="mt-4 flex w-full items-center justify-between px-2 py-1">
                <h1 className="text-3xl font-semibold">Loading Songs</h1>
                <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-md bg-card-skelet" />
                    <div className="w-10 h-10 rounded-md bg-card-skelet" />
                    <div className="w-16 h-8 rounded-md bg-card-skelet">

                    </div>
                </div>
            </div>
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
        </>
    );
}

