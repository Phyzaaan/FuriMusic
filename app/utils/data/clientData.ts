import { createClient } from "../supabase/client";
import { Song, Playlist, Artist } from "./type";

type LoadMoreSongsParams = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  offset: number;
  setOffset: (offset: number) => void;
  setSongsList: React.Dispatch<React.SetStateAction<Song[]>>;
};

export async function loadMoreSongs({
  loading,
  setLoading,
  hasMore,
  setHasMore,
  offset,
  setOffset,
  setSongsList,
}: LoadMoreSongsParams) {
  if (loading || !hasMore) return;
  setLoading(true);

  const supabase = createClient();
  const limit = 12;
  const from = offset;
  const to = offset + limit - 1;

  const { data, error } = await supabase
    .from("Songs")
    .select(`
        id, 
        name, 
        url, 
        banner, 
        duration,
        song_artists (Artists(name, id))
      `)
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching more songs:", error);
    setLoading(false);
    return;
  }

  if (data && data.length > 0) {
    const newSongs: Song[] = data.map((song) => {
      return {
        id: song.id,
        name: song.name,
        url: song.url,
        banner: song.banner,
        duration: song.duration,
        // I dont really understand this peice of code!!! I do know it uses flatMap and checks if the Artists is an array or a object. if its and array it maps over it if its not array it just gram the name. if its neither is just returns "Uknow Artist"
        artists: song.song_artists.flatMap((sa) => {
          const artistData = sa.Artists;
          if (Array.isArray(artistData)) {
            return artistData.map((a) => ({ id: a.id, name: a.name }));
          }
          if (artistData && typeof artistData === "object") {
            return [{ id: (artistData as { id: number }).id, name: (artistData as { name: string }).name }];
          }
          return [{ id: 0, name: "Unknown Artist" }];
        })
      };
    });

    setSongsList((prevSongs: Song[]) => [...prevSongs, ...newSongs]);
    setOffset(offset + limit);

    if (data.length < limit) {
      setHasMore(false);
    }
  } else {
    setHasMore(false);
  }

  setLoading(false);
}


type LoadMorePlaylistsParams = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  offset: number;
  setOffset: (offset: number) => void;
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
};
export async function loadMorePlaylists({
  loading,
  setLoading,
  hasMore,
  setHasMore,
  offset,
  setOffset,
  setPlaylists
}: LoadMorePlaylistsParams) {
  const supabase = createClient();
  if (!hasMore || loading) return;
  setLoading(true);

  const limit = 8;
  const from = offset;
  const to = offset + limit - 1;

  const { error, data } = await supabase.from("Playlists").select(`
    id, 
    name, 
    banner, 
    playlist_songs(count)
  `)
    .range(from, to);

  if (error || !data) {
    console.error(error.message);
    setLoading(false);
    return;
  }
  if (data && data.length > 0) {
    const newPlaylists = data.map((playlist) => {
      // Extract the count from the nested array object
      const totalSongs = playlist.playlist_songs?.[0]?.count || 0;

      return {
        id: playlist.id,
        name: playlist.name,
        banner: playlist.banner,
        totalSongs,
      };
    });

    setPlaylists((prevPlaylists: Playlist[]) => [...prevPlaylists, ...newPlaylists])
    setOffset(offset + limit);

    if (data.length < limit) {
      setHasMore(false);
    }
  } else {
    setHasMore(false);
  }

  setLoading(false);
}


type LoadMoreArtistsParams = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasMore: boolean;
  setHasMore: (hasMore: boolean) => void;
  offset: number;
  setOffset: (offset: number) => void;
  setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
};
export async function loadMoreArtists({
  loading,
  setLoading,
  hasMore,
  setHasMore,
  offset,
  setOffset,
  setArtists
}: LoadMoreArtistsParams) {
  const supabase = createClient();
  if (!hasMore || loading) return;
  setLoading(true);

  console.log("Loading Artists")

  const limit = 8;
  const from = offset;
  const to = offset + limit - 1;

  const { error, data } = await supabase.from("Artists").select("id, name, banner")
    .range(from, to);

  if (error || !data) {
    console.error(error.message);
    setLoading(false);
    return;
  }
  if (data && data.length > 0) {
    const newArtists = data.map((artist) => {
      return {
        id: artist.id,
        name: artist.name,
        banner: artist.banner,
      };
    });

    setArtists((prevArtists: Artist[]) => [...prevArtists, ...newArtists])
    setOffset(offset + limit);

    if (data.length < limit) {
      setHasMore(false);
    }
  } else {
    setHasMore(false);
  }

  setLoading(false);
}