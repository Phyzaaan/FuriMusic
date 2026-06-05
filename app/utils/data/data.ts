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
      song_artists(Artists(name, id))
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


export async function fetchPlaylistInfo(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data: playlist } = await supabase.from("Playlists")
    .select(`id, name, banner, createdBy, playlist_songs(count)`)
    .eq("id", id)
    .single();

  if (error || !playlist) {
    console.error(error.message);
    return;
  }

  return {
    id: playlist.id,
    name: playlist.name,
    banner: playlist.banner,
    createdBy: playlist.createdBy,
    totalSongs: playlist.playlist_songs.flatMap(playlist => playlist.count)[0],
  }
}

export async function fetchPlaylistBody(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data: playlistSongs } = await supabase.from("playlist_songs")
    .select(`
      Songs( 
        id, 
        name,
        url,
        banner,
        duration,
        song_artists(Artists(name, id))
      )
    `)
    .eq("playlist_id", id);

  if (error || !playlistSongs) {
    console.error(error.message);
    return [];
  }

  return playlistSongs
    .map((data) => {
      const song = Array.isArray(data.Songs) ? data.Songs[0] : data.Songs;

      return {
        id: song.id,
        name: song.name,
        url: song.url,
        banner: song.banner,
        duration: song.duration,
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
}

export async function fetchArtistInfo(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data: artist } = await supabase.from("Artists")
    .select(`id, name, banner, song_artists(count)`)
    .eq("id", id)
    .single();

  if (error || !artist) {
    console.error(error.message);
    return;
  }

  return {
    id: artist.id,
    name: artist.name,
    banner: artist.banner,
    totalSongs: artist.song_artists.flatMap(artist => artist.count)[0],
  }
}


export async function fetchArtistBody(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data: ArtistSongs } = await supabase.from("song_artists")
    .select(`
    Songs( 
    id, 
    name,
    url,
    banner,
    duration,
    song_artists(Artists(name, id))
    )`)
    .eq("artist_id", id);

  if (error || !ArtistSongs) {
    console.error(error.message);
    return;
  }

  return ArtistSongs
    .map((data) => {
      const song = Array.isArray(data.Songs) ? data.Songs[0] : data.Songs;

      return {
        id: song.id,
        name: song.name,
        url: song.url,
        banner: song.banner,
        duration: song.duration,
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
}