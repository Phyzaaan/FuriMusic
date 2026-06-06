import SongsCardSkeleton from "../components/SongCard";

type Props = {
    carousel?: boolean
}

export default function SongsSectionSkeleton({ carousel = true }: Props) {
    return (
        <div className={`no-scrollbar mx-auto shrink-0 w-full max-w-[calc(100%-16px)] px-2 py-2
        flex ${carousel ? 'snap-x snap-mandatory gap-4 overflow-x-auto' : 'flex-col'}
        `}>
            {carousel ? (
                Array.from({ length: 4 }).map((_, columnIndex) => (
                    <div
                        key={columnIndex}
                        className="flex h-full w-[90%] min-w-[95%] snap-start flex-col gap-3 md:w-100 md:min-w-100"
                    >
                        {Array.from({ length: 4 }).map((__, i) => (
                            <SongsCardSkeleton key={`${columnIndex}-${i}`} />
                        ))}
                    </div>
                ))
            ) : (
                Array.from({ length: 10 }).map((__, i) => (
                    <SongsCardSkeleton key={i} />
                ))
            )}
        </div>
    );
}

