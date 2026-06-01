import { loadSong } from "./playSong";
import { Song } from "../data/type";

export function saveToLocalStorage(currTime: number | undefined, currSong: Song | null, repeat: boolean) {
  if (!currTime || !currSong) return;
  const data = {
    song: currSong,
    time: currTime,
    repeat: repeat
  };
  
  localStorage.setItem("playingSong", JSON.stringify(data));
}

export function LoadLocalStorage(
  setCurrTrack: (track: Song | null) => void,
  audioInstance: HTMLMediaElement,
  setRepeat: (value: boolean) => void,
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
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}
