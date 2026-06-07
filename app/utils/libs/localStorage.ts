import { loadSong } from "./playSong";
import { Song } from "../data/type";

export function saveToLocalStorage(currTime: number | undefined, currSong: Song | null, repeat: boolean, queue: Song[]) {
  if (!currTime || !currSong) return;
  const data = {
    song: currSong,
    time: currTime,
    repeat: repeat,
    queue: queue,
  };
  try {
    localStorage.setItem("playingSong", JSON.stringify(data));
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}

export function LoadLocalStorage(
  setCurrTrack: (track: Song | null) => void,
  audioInstance: HTMLMediaElement,
  setRepeat: (value: boolean) => void,
  setQueue: (value: Song[]) => void,
  setFav: (value: Song[]) => void,
) {
  const rawData = localStorage.getItem("playingSong");
  if (!rawData) return;
  try {
    const data = JSON.parse(rawData);
    if (!data) return;
    audioInstance.currentTime = data.time;
    setCurrTrack(data.song);
    setRepeat(data.repeat);
    loadSong(data.song);
    if (data.queue) setQueue(data.queue);
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
  const rawFav = localStorage.getItem("Favorite");
  if (!rawFav) return;
  try {
    const data = JSON.parse(rawFav);
    if (!data) return;
    setFav(data.fav)
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}

export function saveFavToLocalStorage(fav: Song[]) {
  if (!fav) return;
  const data = {
    fav: fav,
  };
  try {
    localStorage.setItem("Favorite", JSON.stringify(data));
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}
