import PlaylistCard from "@/app/ui/components/PlaylistCard";
import { Playlist } from "@/app/utils/data/type";
import ErrorMsg from "@/app/ui/components/Error";

function PlaylistsSection({ Playlists }: { Playlists: Playlist[] | undefined }) {
    return (
        <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
            {Playlists && Playlists.length > 0 ? Playlists.map(({ id, banner, name, totalSongs }) => {
                return (
                    <PlaylistCard
                        key={id}
                        id={id}
                        banner={banner}
                        name={name}
                        totalSongs={totalSongs}
                    />
                );
            }) : (
                <ErrorMsg>There is NOTING!</ErrorMsg>
            )}
        </div>
    );
}

export default PlaylistsSection;
