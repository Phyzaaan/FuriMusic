"use client"
import { SecondaryBtn } from "@/app/ui/components/Buttons";
import PlaylistCard from "@/app/ui/components/PlaylistCard";
import { fetchPlaylistsRange } from "@/app/utils/data/data";
import { Playlist } from "@/app/utils/data/type";
import { useState } from "react";

interface PlaylistProps {
  Playlists: Playlist[];
}

function PlaylistsSection({ Playlists }: PlaylistProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>(Playlists);
  const [loading, setLoading] = useState(false);

  const [offset, setOffset] = useState(25);
  const [hasMore, setHasMore] = useState(Playlists.length === 25);

  const loadMore = async () => {
    setLoading(true);
    const newPlaylists = await fetchPlaylistsRange(25, offset);
    if (newPlaylists) {
      setPlaylists([...playlists, ...newPlaylists]);
      setOffset(offset + 25);
      if (newPlaylists?.length < 25) setHasMore(Playlists.length < 25);
    }
    setLoading(false);
  }
  return (
    <>
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
      {hasMore && (
        <SecondaryBtn
          onClick={() => loadMore()}
          disabled={loading}
        >{loading ? "Loading..." : "Load More"}</SecondaryBtn>
      )}
    </>
  );
}

export default PlaylistsSection;
