import SongsSectionSkeleton from "../skeleton/sections/Songs";


export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <SongsSectionSkeleton carousel={false} />
        </main>
    );
}