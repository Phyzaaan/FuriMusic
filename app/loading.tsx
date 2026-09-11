import TitleSkeleton from "./skeleton/components/Title";
import SongsSectionSkeleton from "./skeleton/sections/Songs";
import PlaylistsSectionSkeleton from "./skeleton/sections/Playlists";

export default function Loading() {
    return (
        <main className="flex h-full w-full flex-col overflow-y-auto pb-20 pt-22 no-scrollbar">
            <div className="space-y-2">
                <TitleSkeleton />
                <PlaylistsSectionSkeleton />
            </div>

            <div className="space-y-2 pt-2">
                <TitleSkeleton />
                <SongsSectionSkeleton />
            </div>
        </main>
    );
}
