import { loadSong } from "./playSong";

export function saveToLocalStorage(currTime: number | undefined, currSongId: string, repeat: boolean) {
  if (!currTime || !currSongId) return;
  const data = {
    songId: currSongId,
    time: currTime,
    repeat: repeat
  };
  
  localStorage.setItem("playingSong", JSON.stringify(data));
}

export function LoadLocalStorage(
  setCurrSongId: (value: string) => void,
  audioInstance: HTMLMediaElement,
  setRepeat: (value: boolean) => void,
) {
  const rawData = localStorage.getItem("playingSong");
  if (!rawData) return;
  try {
    const data = JSON.parse(rawData);
    if (!data.songId || !data.time || !data.repeat) return;
    audioInstance.currentTime = data.time;
    setCurrSongId(data.songId);
    setRepeat(data.repeat);
    loadSong(data.songId, setCurrSongId);
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}
