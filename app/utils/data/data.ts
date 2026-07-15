import { createClient } from "../supabase/client";
import { Artist } from "./type";

export async function fetchSongsRange(
  limit = 12,
  offset = 0,
  filter?: string,
  random?: boolean,
) {
  const supabase = createClient();

  // Calculate the range bounds for Postgres (.range() is inclusive)
  let from = offset;
  let to = offset + limit - 1;

  if (random) {
    const { count, error: countError } = await supabase
      .from("Songs")
      .select("id", { count: "exact", head: true });

    if (countError || !count) {
      console.error("Error fetching songs range:", countError?.details);
      return;
    }

    const totalChunks = Math.ceil(count / limit);
    const randomChunk = Math.floor(Math.random() * totalChunks + 1);
    const randomOffset = Math.min(count - limit, randomChunk * limit - limit);

    from = randomOffset;
    to = randomOffset + limit - 1;
  }

  let query = supabase
    .from("Songs")
    .select(
      `
      id, 
      name, 
      url, 
      banner, 
      duration,
      song_artists(Artists(name, id))
    `,
    )
    .order("name", { ascending: true })
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
        return [
          {
            id: (artistData as { id: number }).id,
            name: (artistData as { name: string }).name,
          },
        ];
      }
      return [{ id: 0, name: "Unknown Artist" }];
    }),
  }));
}

export async function fetchPlaylistsRange(
  limit = 8,
  offset = 0,
  filter?: string,
  random?: boolean,
) {
  const supabase = createClient();

  // Calculate the range bounds for Postgres (.range() is inclusive)
  let from = offset;
  let to = offset + limit - 1;

  if (random) {
    const { count, error: countError } = await supabase
      .from("Playlists")
      .select("id", { count: "exact", head: true });

    if (countError || !count) {
      console.error("Error fetching playlists range:", countError?.details);
      return;
    }

    const totalChunks = Math.ceil(count / limit);
    const randomChunk = Math.floor(Math.random() * totalChunks + 1);
    const randomOffset = Math.min(count - limit, randomChunk * limit - limit);

    from = randomOffset;
    to = randomOffset + limit - 1;
  }

  let query = supabase
    .from("Playlists")
    .select(
      `
    id, 
    name, 
    banner, 
    playlist_songs(count)
  `,
    )
    .order("name", { ascending: true })
    .range(from, to);

  if (filter && filter.length > 0) {
    query = query.ilike("name", `%${filter}%`);
  }

  const { data, error } = await query;
  if (error || !data) {
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

export async function fetchArtistsRange(
  limit = 8,
  offset = 0,
  filter?: string,
  random?: boolean,
) {
  const supabase = createClient();

  // Calculate the range bounds for Postgres (.range() is inclusive)
  let from = offset;
  let to = offset + limit - 1;

  if (random) {
    const { count, error: countError } = await supabase
      .from("Playlists")
      .select("id", { count: "exact", head: true });

    if (countError || !count) {
      console.error("Error fetching songs range:", countError?.details);
      return;
    }

    const totalChunks = Math.ceil(count / limit);
    const randomChunk = Math.floor(Math.random() * totalChunks + 1);
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

export async function fetchSongById(id: number[]) {
  const supabase = createClient();

  const { data: Song, error } = await supabase
    .from("Songs")
    .select(
      `
      id, 
      name, 
      url, 
      banner, 
      duration,
      song_artists(Artists(name, id))
    `,
    ).order("name", { ascending: true })
    .in("id", id);

  if (error) {
    console.error("Error fetching song by Id:", error.details);
    return;
  }
  if (!Song) return;

  // Clean up the deeply nested relational data into a flat array of strings
  return Song.map((song) => ({
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
        return [
          {
            id: (artistData as { id: number }).id,
            name: (artistData as { name: string }).name,
          },
        ];
      }
      return [{ id: 0, name: "Unknown Artist" }];
    }),
  }));
}

export async function fetchPlaylistInfo(id: number) {
  const supabase = createClient();

  const { error, data: playlist } = await supabase
    .from("Playlists")
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
    totalSongs: playlist.playlist_songs.flatMap(
      (playlist) => playlist.count,
    )[0],
  };
}

export async function fetchPlaylistBody(id: number) {
  const supabase = createClient();

  const { error, data: playlistSongs } = await supabase
    .from("playlist_songs")
    .select(
      `
      Songs( 
        id, 
        name,
        url,
        banner,
        duration,
        song_artists(Artists(name, id))
      )
    `,
    )
    .eq("playlist_id", id);

  if (error || !playlistSongs) {
    console.error(error.details);
    return;
  }

  const songs = playlistSongs.map((data) => {
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
          return [
            {
              id: (artistData as { id: number }).id,
              name: (artistData as { name: string }).name,
            },
          ];
        }
        return [{ id: 0, name: "Unknown Artist" }];
      }),
    };
  });
  return songs.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchArtistInfo(id: number) {
  const supabase = createClient();

  const { error, data: artist } = await supabase
    .from("Artists")
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
    totalSongs: artist.song_artists.flatMap((artist) => artist.count)[0],
  };
}

export async function fetchArtistBody(id: number) {
  const supabase = createClient();

  const { error, data: ArtistSongs } = await supabase
    .from("song_artists")
    .select(
      `
    Songs( 
    id, 
    name,
    url,
    banner,
    duration,
    song_artists(Artists(name, id))
    )`,
    )
    .eq("artist_id", id);

  if (error || !ArtistSongs) {
    console.error(error.details);
    return;
  }

  const songs = ArtistSongs.map((data) => {
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
          return [
            {
              id: (artistData as { id: number }).id,
              name: (artistData as { name: string }).name,
            },
          ];
        }
        return [{ id: 0, name: "Unknown Artist" }];
      }),
    };
  });
  return songs.sort((a, b) => a.name.localeCompare(b.name));
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

export function sanitizeName(filename: string) {
  return filename
    .toLowerCase()
    .trim()
    .replace(/\.(?=.*\.)|[^a-z0-9.\s]/g, "") // Keep only the last dot
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

export async function uploadFile(
  bucket: string,
  file: File,
  name: string,
): Promise<string | null> {
  const supabase = createClient();
  const filename = name + file.name.split(".").pop();
  const sanitizedName = sanitizeName(filename);

  const { data: exists } = await supabase.storage
    .from(bucket)
    .exists(sanitizedName);

  if (exists) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([sanitizedName]);

    if (error) {
      console.error(error.message);
      return null;
    }
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(sanitizedName, file);
  if (error) {
    console.error(error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(sanitizedName);
  return data.publicUrl;
}

export async function uploadSong(song: {
  name: string;
  banner: string;
  url: string;
  duration: string;
  artists?: {
    id: number;
  }[];
  artistsIds?: number[];
  lyrics?: string | null | undefined;
}): Promise<null | number> {
  const supabase = createClient();

  const data = {
    name: song.name,
    banner: song.banner,
    url: song.url,
    duration: song.duration,
    lyrics: song.lyrics,
  };

  const { error: songError, data: songData } = await supabase
    .from("Songs")
    .insert(data)
    .select("id")
    .single();
  if (songError) {
    console.error(songError.message);
    return null;
  }

  const artistIds = (song.artistsIds ?? song.artists?.map((artist) => artist.id) ?? []).filter(
    (value): value is number => typeof value === "number" && value > 0,
  );

  if (artistIds.length > 0) {
    const artistsData = artistIds.map((artistId) => ({
      song_id: songData.id,
      artist_id: artistId,
    }));

    const { error } = await supabase.from("song_artists").insert(artistsData);

    if (error) {
      console.error(error.message);
      return null;
    }
  }

  return songData.id;
}
export async function updateSong(song: {
  id: number;
  name: string;
  banner: string;
  artistsIds: number[];
  lyrics?: string | null | undefined;
}): Promise<null | number> {
  const supabase = createClient();

  const data = { name: song.name, banner: song.banner, lyrics: song.lyrics };

  const { error: songError } = await supabase
    .from("Songs")
    .update(data)
    .eq("id", song.id);
  if (songError) {
    console.error(songError.message);
    return null;
  }

  const artistsData = song.artistsIds.map((id) => ({
    song_id: song.id,
    artist_id: id,
  }));

  // Wipe out existing associations for this song
  await supabase.from("song_artists").delete().eq("song_id", song.id);

  // Freshly insert the current list
  const { error } = await supabase.from("song_artists").insert(artistsData);

  if (error) {
    console.error(error.message);
    return null;
  }

  return 200;
}
export async function uploadArtist(artist: { name: string; banner: string }): Promise<null | number> {
  const supabase = createClient();

  const { data: existing } = await supabase.from("Artists").select("id").eq("name", artist.name).single();
  if (existing) return existing.id;

  const { data, error } = await supabase.from("Artists").insert(artist).select("id").single();
  if (error) console.error(error.message);
  return data?.id ?? null;
}

export async function updateArtist(artist: Artist): Promise<null | number> {
  const supabase = createClient();

  const data = { name: artist.name, banner: artist.banner };

  const { error: artistError } = await supabase
    .from("Artists")
    .update(data)
    .eq("id", artist.id);

  if (artistError) {
    console.error(artistError.message);
    return null;
  }

  return 200;
}

export async function uploadPlaylist(playlist: {
  name: string;
  banner: string;
}): Promise<null | number> {
  const supabase = createClient();

  const data = { name: playlist.name, banner: playlist.banner };

  const { error: playlistError } = await supabase
    .from("Playlists")
    .upsert(data)
    .select("id")
    .single();

  if (playlistError) {
    console.error(playlistError.message);
    return null;
  }

  return 10;
}
export async function updatePlaylist(playlist: {
  id: number;
  name: string;
  banner: string;
}): Promise<null | number> {
  const supabase = createClient();

  const data = { name: playlist.name, banner: playlist.banner };

  const { error: playlistError } = await supabase
    .from("Playlists")
    .update(data)
    .eq("id", playlist.id);

  if (playlistError) {
    console.error(playlistError.message);
    return null;
  }

  return 200;
}

export async function deleteItem(
  table: string,
  id: number,
): Promise<number | null> {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    console.error(error.message);
    return null;
  }

  return 200;
}

export async function songInPlaylists(songId: number): Promise<number[] | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("playlist_songs")
    .select("playlist_id")
    .eq("song_id", songId);

  if (error || !data) {
    console.error(error.message);
    return null;
  }

  return data.map((item) => item.playlist_id);
}

export async function toggleSongInPlaylist({
  songId,
  playlistId,
}: {
  songId: number;
  playlistId: number;
}): Promise<{ added: boolean } | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("playlist_songs")
    .select("song_id")
    .eq("song_id", songId)
    .eq("playlist_id", playlistId)
    .maybeSingle();

  if (error) {
    console.error(error.message);
    return null;
  }

  const exists = !!data;

  if (exists) {
    const { error: deleteErr } = await supabase
      .from("playlist_songs")
      .delete()
      .eq("song_id", songId)
      .eq("playlist_id", playlistId);

    if (deleteErr) {
      console.error(deleteErr.message);
      return null;
    }

    return { added: false };
  }

  const { error: insertErr } = await supabase
    .from("playlist_songs")
    .insert({ song_id: songId, playlist_id: playlistId });

  if (insertErr) {
    console.error(insertErr.message);
    return null;
  }

  return { added: true };
}



export async function fetchSuggestions() {
  const supabase = createClient();

  const { data: songs, error } = await supabase
    .from("Suggestions")
    .select(
      `
      id,
      name,
      url,
      banner,
      duration,
      existing_artists,
      new_artists
    `,
    )
    .order("name", { ascending: true })

  if (error || !songs) {
    console.error("Error fetching suggestions:", error ?? songs);
    return [];
  }

  const artistIds = songs.map(song => Array.isArray(song.existing_artists)
    ? song.existing_artists.filter((id): id is number => typeof id === "number" && id > 0)
    : []).flat();

  const { data: artists } = await supabase.from("Artists").select("id, name").in("id", artistIds);

  return songs.map((song) => {
    const songName = typeof song.name === "string" && song.name.trim().length > 0 ? song.name.trim() : "Untitled";
    const songUrl = typeof song.url === "string" && song.url.trim().length > 0 ? song.url.trim() : "";
    const songBanner = typeof song.banner === "string" && song.banner.trim().length > 0 ? song.banner.trim() : "";
    const songDuration = typeof song.duration === "string" && song.duration.trim().length > 0 ? song.duration.trim() : "";

    const existingArtistIds = Array.isArray(song.existing_artists)
      ? song.existing_artists.filter((id): id is number => typeof id === "number" && id > 0)
      : [];

    const existingArtists = artists ? artists.filter(artist => existingArtistIds.includes(artist.id)) : [];

    const newArtists = Array.isArray(song.new_artists)
      ? song.new_artists.filter(
        (artist): artist is { name: string; banner: string } =>
          !!artist &&
          typeof artist === "object" &&
          typeof artist.name === "string" &&
          artist.name.trim().length > 0,
      ) : [];

    return {
      id: song.id,
      name: songName,
      url: songUrl,
      banner: songBanner,
      duration: songDuration,
      artists: existingArtists,
      pendingArtists: newArtists,
    };
  });
}

export async function uploadSuggestionSong(
  file: File,
  path: string,
  token: string
) {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from("songs")
    .uploadToSignedUrl(path, token, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from("songs").getPublicUrl(path);

  return data.publicUrl;
}


export async function downloadAndUploadSuggestionSong(
  youtubeUrl: string,
  name: string,
  captchaToken: string
): Promise<string> {
  const fileName = name + ".mp3";
  // Verify CAPTCHA & get signed upload token
  const uploadRes = await fetch("/api/getUploadUrl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      captchaToken,
      name: name,
      extension: "mp3",
    }),
  });

  if (!uploadRes.ok) {
    alert("Make sure You are authenticated!");
    throw new Error("Failed to get upload token.");
  }

  const { token, path } = await uploadRes.json();

  // Get the download URL
  const downloadRes = await fetch("/api/getAudioUrl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      youtubeUrl,
    }),
  });

  if (!downloadRes.ok) {
    throw new Error("Failed to get download URL.");
  }

  const { downloadUrl } = await downloadRes.json();

  // Download the MP3
  const blob = await fetch(downloadUrl).then((r) => {
    if (!r.ok) throw new Error("Failed to download audio.");
    return r.blob();
  });

  // Create a File
  const file = new File(
    [blob],
    sanitizeName(fileName),
    {
      type: "audio/mpeg",
    }
  );

  // Upload to Supabase
  return await uploadSuggestionSong(file, path, token);
}
