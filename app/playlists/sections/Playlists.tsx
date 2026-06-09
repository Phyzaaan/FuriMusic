"use client";
import PlaylistCard from "@/app/ui/components/PlaylistCard";
import PlaylistsSectionSkeleton from "../../skeleton/sections/Playlists";
import { Playlist } from "@/app/utils/data/type";
import { fetchPlaylistsRange } from "@/app/utils/data/data";
import useSWR from "swr";
import ErrorMsg from "@/app/ui/components/Error";

function PlaylistsSection() {
  const swrOptions = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  };

  const { data: playlists, isLoading } = useSWR<Playlist[] | undefined>(
    "AllPlaylists",
    async () => await fetchPlaylistsRange(100),
    swrOptions
  );

  if (isLoading) return (<PlaylistsSectionSkeleton carousel={false} />)
  if (!playlists) return <ErrorMsg>404 NOT FOUND</ErrorMsg>;

  return (
    <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
      {playlists && playlists.map(({ id, banner, name, totalSongs }) => {
        return (
          <PlaylistCard
            key={id}
            id={id}
            banner={banner}
            name={name}
            totalSongs={totalSongs}
          />
        );
      })}
    </div>
  );
}

export default PlaylistsSection;
