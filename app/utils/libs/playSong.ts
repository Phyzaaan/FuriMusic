let audioInstance: HTMLAudioElement | null = null;

import formatArtists from "./formatArtists";

import { Song } from "../data/type";

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

  if (audioInstance.src !== songUrl) {
    audioInstance.src = songUrl;
    if (load) audioInstance.load();
    if (play) playSong();

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
  }
}

export function playSong() {
  if (!audioInstance) return;
  if (audioInstance.paused) {
    audioInstance.play();
  }
}

export function pauseSong() {
  if (!audioInstance || audioInstance.paused) return;
  audioInstance.pause();
}
