import Songs from "../data/songs";
import { loadSong } from "./playSong";

export function getNextSongIndex(currSongId: string) {
  const currentIndex = Songs.findIndex((song) => song.id === currSongId);
  return (currentIndex + 1) % Songs.length;
}

export function getPrevSongIndex(currSongId: string) {
  const currentIndex = Songs.findIndex((song) => song.id === currSongId);
  return currentIndex === 0 ? Songs.length - 1 : currentIndex - 1;
}

export function handleNextSong(
  currSongId: string,
  setCurrSongId: (song: string) => void,
) {
  const nextIndex = getNextSongIndex(currSongId);
  loadSong(Songs[nextIndex].id, setCurrSongId, true);
  setCurrSongId(Songs[nextIndex].id);
}

export function handlePrevSong(
  currSongId: string,
  setCurrSongId: (song: string) => void,
) {
  const prevIndex = getPrevSongIndex(currSongId);
  loadSong(Songs[prevIndex].id, setCurrSongId, true);
  setCurrSongId(Songs[prevIndex].id);
}

export function handleShuffle(setCurrSongId: (song: string) => void) {
  const currIndex = Math.floor(Math.random() * Songs.length);
  loadSong(Songs[currIndex].id, setCurrSongId, true);
  setCurrSongId(Songs[currIndex].id);
}
