import { PlaylistInfoSkeleton } from "../skeleton/sections/Playlists";
import SongsSectionSkeleton from "@/app/skeleton/sections/Songs";
export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <PlaylistInfoSkeleton />
            <SongsSectionSkeleton carousel={false} />
        </main>
    );
}