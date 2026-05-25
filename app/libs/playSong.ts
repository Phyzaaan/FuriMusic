let audioInstance: HTMLAudioElement | null = null;

import Songs from "../data/songs";
import { handleNextSong, handlePrevSong } from "./changeSong";

if (typeof window !== "undefined") {
  audioInstance = new Audio();
}

export const getAudioInstance = () => audioInstance;

export function loadSong(
  currSongId: string,
  setCurrSongId: (value: string) => void,
  play: boolean = false,
) {
  if (!audioInstance) {
    console.error("Audio instance is not available.");
    return;
  }

  const song = Songs.find((song) => song.id === currSongId);
  const songUrl = `/Songs/${song?.url}`;
  console.log(songUrl);

  const url = songUrl ? new URL(songUrl, window.location.origin).href : "";

  console.log(url);

  if (audioInstance.src !== url) {
    audioInstance.src = url;
    audioInstance.load();
    if (play) playSong();
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song?.name,
        artist: song?.artist,
        album: "Furi Album",
        artwork: [
          {
            src: song ? `/SongsBanner/${song.banner}` : "",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        playSong();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        pauseSong();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        handlePrevSong(currSongId, setCurrSongId);
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        handleNextSong(currSongId, setCurrSongId);
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
