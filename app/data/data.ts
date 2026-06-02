import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";

export async function fetchAllSongs() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch all songs
  const { error: songError, data: songs } = await supabase
    .from("Songs")
    .select("id, name, url, banner, duration, artists, lyrics");

  if (songError || !songs) {
    console.error("Error fetching songs:", songError);
    return [];
  }

  // Fetch all artists
  const { error: artistError, data: artists } = await supabase
    .from("Artists")
    .select("id, name");

  if (artistError || !artists) {
    console.error("Error fetching artists:", artistError);
    return [];
  }

  // Quick Lookup Function
  const artistLookup = Object.fromEntries(
    artists.map((artist) => [artist.id, artist.name]),
  );

  // Replace artists ids with artists names
  const songsWithArtistNames = songs.map((song) => {
    const artistNamesArray = song.artists
      ? song.artists.map((id: number) => artistLookup[id] || "Unknown Artist")
      : [];

    return {
      ...song,
      artists: artistNamesArray,
    };
  });

  return songsWithArtistNames;
}

export async function fetchTopSongs() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch Top songs
  const { error: songError, data: songs } = await supabase
    .from("Songs")
    .select("id, name, url, banner, duration, artists, lyrics")
    .limit(16);

  if (songError || !songs) {
    console.error("Error fetching songs:", songError);
    return [];
  }

  // Extract and flatten all artist IDs from the songs array
  const masterArtistIds = Array.from(
    new Set(songs.flatMap((song) => song.artists || [])),
  );

  // Fetch ONLY the artists that are in masterArtistIds
  const { error: artistError, data: artists } = await supabase
    .from("Artists")
    .select("id, name")
    .in("id", masterArtistIds);

  if (artistError || !artists) {
    console.error("Error fetching artists:", artistError);
    return [];
  }

  // Quick Lookup Function
  const artistLookup = Object.fromEntries(
    artists.map((artist) => [artist.id, artist.name]),
  );

  // Replace artists ids with artists names
  const songsWithArtistNames = songs.map((song) => {
    const artistNamesArray = song.artists
      ? song.artists.map((id: number) => artistLookup[id] || "Unknown Artist")
      : [];

    return {
      ...song,
      artists: artistNamesArray,
    };
  });

  return songsWithArtistNames;
}

export async function fetchAllPlaylists() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data } = await supabase
    .from("Playlists")
    .select("id, name, banner, songs");

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data;
}


export async function fetchTopPlaylists() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data } = await supabase
    .from("Playlists")
    .select("id, name, banner, songs").limit(10);

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data;
}


export async function fetchAllArtists() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error: artistErr, data: artists } = await supabase
    .from("Artists")
    .select("name, banner, id");

  if (artistErr || !artists) {
    console.error("Error fetching artists:", artistErr);
    return [];
  }

  return artists;
}

export async function fetchTopArtists() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error: artistErr, data: artists } = await supabase
    .from("Artists")
    .select("name, banner, id")
    .limit(10);

  if (artistErr || !artists) {
    console.error("Error fetching artists:", artistErr);
    return [];
  }

  return artists;
}
