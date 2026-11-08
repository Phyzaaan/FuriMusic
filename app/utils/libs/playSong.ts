
import formatArtists from "./formatArtists";

import { Song } from "../data/type";
import { furiLog } from "./debug";

let audioInstance: HTMLAudioElement | null = null;

if (typeof window !== "undefined") {
  audioInstance = new Audio();
}

export const getAudioInstance = () => audioInstance;

export function loadSong(currTrack: Song, play: boolean = false, load = false) {
  if (!audioInstance) {
    console.error("Audio instance is not available.");
    return;
  }

  const songUrl = currTrack.blobUrl || currTrack.url;

  furiLog("load-song", {
    track: currTrack.id,
    source: currTrack.blobUrl ? "blob" : "supabase",
  });

  if (audioInstance.src !== songUrl) {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currTrack.name,
        artist: formatArtists(currTrack.artists.map(artist => artist.name)) ?? "Unknown Artist",
        album: "Furi Album",
        artwork: [
          {
            src: currTrack.banner,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });
    }

    audioInstance.src = songUrl;
    if (load) audioInstance.load();
    if (play) playSong();
  }
}

export async function playSong() {
  if (!audioInstance || !audioInstance.paused) return;
  try {
    await audioInstance.play();

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "playing";
    }
  } catch (error) {
    furiLog("play-rejected", {
      error: error instanceof Error ? error.message : String(error),
    });

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "paused";

    }
  }
}

export function pauseSong() {
  if (!audioInstance || audioInstance.paused) return;
  audioInstance.pause();
  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = "paused";
  }
}
