import PlaylistCard from "@/app/ui/components/PlaylistCard";
import { Playlist } from "@/app/utils/data/type";

type Playlists = {
  Playlists: Playlist[];
};

function AllPlaylistsSection({ Playlists }: Playlists) {
  return (
    <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
      {Playlists.length > 0 ? (Playlists.map(({ id, banner, name, totalSongs }) => (
        <PlaylistCard
          key={id}
          id={id}
          banner={banner}
          name={name}
          totalSongs={totalSongs}
        />
      ))) : (
        <h1 className="w-full text-center mx-auto my-auto col-span-full">There is Nothing</h1>
      )
      }
    </div>
  );
}

export default AllPlaylistsSection;
