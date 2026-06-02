import PlaylistCard from "@/app/ui/components/playlistCard";

type Playlists = {
  Playlists: {
    id: number;
    name: string;
    banner: string;
    songs: number[];
  }[];
};

function PlaylistsSection({ Playlists }: Playlists) {
  return (
      <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
        {Playlists.map(({ id, banner, name, songs }) => {
          return (
            <PlaylistCard
              key={id}
              banner={banner}
              name={name}
              tracks={songs.length}
            />
          );
        })}
      </div>
  );
}

export default PlaylistsSection;
