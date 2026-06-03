import { createClient } from "../supabase/server";
import { cookies } from "next/headers";

export async function fetchSongsRange(limit = 12, offset = 0) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Calculate the range bounds for Postgres (.range() is inclusive)
  const from = offset;
  const to = offset + limit - 1;

  const { data: songs, error } = await supabase
    .from("Songs")
    .select(`
      id, 
      name, 
      url, 
      banner, 
      duration,
      song_artists(Artists(name))
    `)
    .order("id", { ascending: true }) // Fast index sorting
    .range(from, to);

  if (error || !songs) {
    console.error("Error fetching songs range:", error);
    return [];
  }

  // Clean up the deeply nested relational data into a flat array of strings
  return songs.map((song) => ({
    id: song.id,
    name: song.name,
    url: song.url,
    banner: song.banner,
    duration: song.duration,
    artists: (song.song_artists as { Artists: unknown }[] || []).flatMap((sa) => {
      const data = sa.Artists;
      // 1. If it's a real array, map it normally
      if (Array.isArray(data)) {
        return data.map((a) => a.name || "Unknown Artist");
      }
      // 2. If it's just a single object, wrap it in an array so flatMap can handle it
      if (data && typeof data === "object" && "name" in data) {
        return [(data as { name: string }).name || "Unknown Artist"];
      }
      return ["Unknown Artist"];
    })
  }));
}

export async function fetchPlaylistsRange(limit = 8, offset = 0) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Calculate the range bounds for Postgres (.range() is inclusive)
  const from = offset;
  const to = offset + limit - 1;

  const { data, error } = await supabase
    .from("Playlists")
    .select(`
    id, 
    name, 
    banner, 
    playlist_songs(count)
  `)
    .range(from, to);

  if (error || !data) return [];

  return data.map((playlist) => {
    // Extract the count from the nested array object
    const totalSongs = playlist.playlist_songs?.[0]?.count || 0;

    return {
      id: playlist.id,
      name: playlist.name,
      banner: playlist.banner,
      totalSongs,
    };
  });
}

export async function fetchArtistsRange(limit = 8, offset = 0) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Calculate the range bounds for Postgres (.range() is inclusive)
  const from = offset;
  const to = offset + limit - 1;

  const { error: artistErr, data: artists } = await supabase
    .from("Artists")
    .select("id, name, banner")
    .range(from, to);

  if (artistErr || !artists) {
    console.error("Error fetching artists:", artistErr);
    return [];
  }

  return artists.map((artist) => {
    return {
      id: artist.id,
      name: artist.name,
      banner: artist.banner,
    };
  });
}