import { loadSong } from "./playSong";

export function saveToLocalStorage(currTime: number | undefined, currSongId: string) {
  if (!currTime || !currSongId) return;
  const data = {
    songId: currSongId,
    time: currTime,
  };
  
  localStorage.setItem("playingSong", JSON.stringify(data));
}

export function LoadLocalStorage(
  setCurrSongId: (value: string) => void,
  audioInstance: HTMLMediaElement,
) {
  const rawData = localStorage.getItem("playingSong");
  if (!rawData) return;
  try {
    const data = JSON.parse(rawData);
    if (!data.songId || !data.time) return;
    audioInstance.currentTime = data.time;
    setCurrSongId(data.songId);
    loadSong(data.songId, setCurrSongId);
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}
