
import formatArtists from "./formatArtists";

import { Song } from "../data/type";
import { furiLog } from "./debug";

let audioInstance: HTMLAudioElement | null = null;

if (typeof window !== "undefined") {
  audioInstance = new Audio();
}

export const getAudioInstance = () => audioInstance;

export async function loadSong(
  currTrack: Song,
  play = false
) {
  if (!audioInstance) return false;

  const audio = audioInstance;
  const songUrl = currTrack.blobUrl || currTrack.url;

  // Update lock-screen metadata
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currTrack.name,
      artist:
        formatArtists(
          currTrack.artists.map(artist => artist.name)
        ) ?? "Unknown Artist",
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

  if (audio.src !== songUrl) {
    audio.pause();
    audio.src = songUrl;
  } else if (audio.error) {
    // Retry an already-failed source.
    audio.load();
  }

  if (play) {
    return await playSong();
  }

  return true;
}

export async function playSong(): Promise<boolean> {
  if (!audioInstance) return false;

  try {
    await audioInstance.play();

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "playing";
    }

    return true;

  } catch (error) {
    const mediaError = audioInstance.error;

    furiLog("play-rejected", {
      errorName:
        error instanceof Error ? error.name : "Unknown",
      errorMessage:
        error instanceof Error ? error.message : String(error),

      mediaErrorCode: mediaError?.code ?? null,
      mediaErrorMessage: mediaError?.message ?? null,

      networkState: audioInstance.networkState,
      readyState: audioInstance.readyState,
    });

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "paused";
    }
    
    pauseSong(); // pausing the song just to play safe

    return false;
  }
}

export function pauseSong() {
  if (!audioInstance || audioInstance.paused) return;
  audioInstance.pause();
  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = "paused";
  }
}
