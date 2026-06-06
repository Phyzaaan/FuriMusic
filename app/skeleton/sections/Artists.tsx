import ArtistCardSkeleton from "../components/ArtistsCard";

type Props = {
    carousel?: boolean
}
export default function ArtistsSectionSkeleton({ carousel = true }: Props) {
    return (
        <div className={`no-scrollbar shrink-0 w-full max-w-[calc(100%-16px)] mx-auto gap-2 px-2 py-1
                ${carousel ? 'flex snap-x snap-mandatory overflow-x-auto' : 'grid grid-cols-2 md:grid-cols-3 justify-items-center'}
                `}>
            {Array.from({ length: 10 }).map((_, idx) => (
                <ArtistCardSkeleton key={idx} />
            ))}
        </div>
    );
}

export function ArtistInfoSkeleton() {
    return (
        <div className="animate-pulse no-scrollbar flex items-center w-full gap-4 px-4 py-2">
            <div className="w-52 h-52 aspect-square rounded-full bg-card-skelet" />
            <div className="py-6 w-full flex flex-col gap-6 items-start justify-center">
                <div>
                    <div className="w-56 h-8 bg-card-skelet" />
                    <div className="w-32 h-5 bg-card-skelet/70" />
                </div>
                <div className="w-24 h-6 bg-card-skelet rounded-md" />
            </div>
        </div>
    );
}