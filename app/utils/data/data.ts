import { createClient } from "../supabase/client";

export async function fetchSongsRange(limit = 12, offset = 0, filter?: string, random?: boolean) {
  const supabase = createClient();

  // Calculate the range bounds for Postgres (.range() is inclusive)
  let from = offset;
  let to = offset + limit - 1;

  if (random) {
    const { count, error: countError } = await supabase
      .from('Songs')
      .select('id', { count: 'exact', head: true });

    if (countError || !count) {
    console.error("Error fetching songs range:", countError?.details);
    return;
  };

    const totalChunks = Math.ceil(count / limit);
    const randomChunk = Math.floor((Math.random() * totalChunks) + 1);
    const randomOffset = Math.min(count - limit, randomChunk * limit - limit);

    from = randomOffset;
    to = randomOffset + limit - 1;
  }

  let query = supabase
    .from("Songs")
    .select(`
      id, 
      name, 
      url, 
      banner, 
      duration,
      song_artists(Artists(name, id))
    `).order("name", { ascending: true })
    .range(from, to);


  if (filter && filter.length > 0) {
    query = query.ilike("name", `%${filter}%`);
  }

  const { data: songs, error } = await query;

  if (error || !songs) {
    console.error("Error fetching songs range:", error.details);
    return;
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

export async function fetchPlaylistsRange(limit = 8, offset = 0, filter?: string, random?: boolean) {
  const supabase = createClient();

  // Calculate the range bounds for Postgres (.range() is inclusive)
  let from = offset;
  let to = offset + limit - 1;

  if (random) {
    const { count, error: countError } = await supabase
      .from('Playlists')
      .select('id', { count: 'exact', head: true });

    if (countError || !count) {
    console.error("Error fetching songs range:", countError?.details);
    return;
  };

    const totalChunks = Math.ceil(count / limit);
    const randomChunk = Math.floor((Math.random() * totalChunks) + 1);
    const randomOffset = Math.min(count - limit, randomChunk * limit - limit);

    from = randomOffset;
    to = randomOffset + limit - 1;
  }

  let query = supabase
    .from("Playlists")
    .select(`
    id, 
    name, 
    banner, 
    playlist_songs(count)
  `).order("name", { ascending: true })
    .range(from, to);

  if (filter && filter.length > 0) {
    query = query.ilike("name", `%${filter}%`);
  }

  const { data, error } = await query;
  if (error || !data){
    console.error("Error fetching songs range:", error.details);
    return;
  }

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

export async function fetchArtistsRange(limit = 8, offset = 0, filter?: string, random?: boolean) {
  const supabase = createClient();

  // Calculate the range bounds for Postgres (.range() is inclusive)
  let from = offset;
  let to = offset + limit - 1;

  if (random) {
    const { count, error: countError } = await supabase
      .from('Playlists')
      .select('id', { count: 'exact', head: true });

    if (countError || !count) {
    console.error("Error fetching songs range:", countError?.details);
    return;
  };

    const totalChunks = Math.ceil(count / limit);
    const randomChunk = Math.floor((Math.random() * totalChunks) + 1);
    const randomOffset = Math.min(count - limit, randomChunk * limit - limit);

    from = randomOffset;
    to = randomOffset + limit - 1;
  }

  let query = supabase
    .from("Artists")
    .select("id, name, banner")
    .order("name", { ascending: true })
    .range(from, to);

  if (filter && filter.length > 0) {
    console.log(filter);
    query = query.ilike("name", `%${filter}%`);
  }

  const { error: artistErr, data: artists } = await query;

  if (artistErr || !artists) {
    console.error("Error fetching artists:", artistErr.details);
    return;
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
  const supabase = createClient();

  const { error, data: playlist } = await supabase.from("Playlists")
    .select(`id, name, banner, playlist_songs(count)`)
    .eq("id", id)
    .single();

  if (error || !playlist) {
    console.error(error.details);
    return;
  }

  return {
    id: playlist.id,
    name: playlist.name,
    banner: playlist.banner,
    totalSongs: playlist.playlist_songs.flatMap(playlist => playlist.count)[0],
  }
}

export async function fetchPlaylistBody(id: number) {
  const supabase = createClient();

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
    console.error(error.details);
    return;
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
  const supabase = createClient();

  const { error, data: artist } = await supabase.from("Artists")
    .select(`id, name, banner, song_artists(count)`)
    .eq("id", id)
    .single();

  if (error || !artist) {
    console.error(error.details);
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
  const supabase = createClient();

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
    console.error(error.details);
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

export async function fetchSongLyrics(id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("Songs")
    .select("lyrics")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching song lyrics:", error);
    return;
  }

  return typeof data.lyrics === "string" ? data.lyrics : "";
}

export async function uploadSuggestion(url: string): Promise<number> {
  const supabase = createClient();

  const { error } = await supabase.from("Suggestions").insert({ url });
  if (error) {
    console.error(error.details)
    return 404;
  }

  return 200;
}