import { createClient } from "../supabase/client";

export async function fetchSongLyrics(id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("Songs")
    .select("lyrics")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error fetching song lyrics:", error);
    return "";
  }

  return typeof data.lyrics === "string" ? data.lyrics : "";
}