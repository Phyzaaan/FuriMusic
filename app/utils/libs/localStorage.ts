import { loadSong } from "./playSong";
import { Song } from "../data/type";
import { fetchSongById } from "../data/data";

export function saveToLocalStorage(currTime: number | undefined, currSong: Song | null, repeat: boolean, queue: Song[]) {
  if (!currTime || !currSong) return;
  const data = {
    song: {...currSong, blobUrl: undefined},
    time: currTime,
    repeat: repeat,
    queue: queue.map(song => song.id),
  };
  try {
    localStorage.setItem("playingSong", JSON.stringify(data));
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}

export async function LoadLocalStorage(
  setCurrTrack: (track: Song | null) => void,
  audioInstance: HTMLMediaElement,
  setRepeat: (value: boolean) => void,
  setQueue: (value: Song[]) => void,
  setFav: (value: Song[]) => void,
) {
  // --- LOAD QUEUE & TRACK ---
  const rawData = localStorage.getItem("playingSong");
  if (rawData) {
    try {
      const data = JSON.parse(rawData);
      if (data) {
        audioInstance.currentTime = data.time || 0;
        setCurrTrack(data.song);
        setRepeat(data.repeat);
        console.log(data.song)
        loadSong(data.song, false, true);

        if (data.queue && data.queue.length > 0) {
          const queue = await fetchSongById(data.queue);
          if (queue) setQueue(queue);
        }
      }
    } catch (e) {
      console.error("Error loading playingSong:", e);
    }
  }

  // --- LOAD FAVORITES ---
  const rawFav = localStorage.getItem("Favorite");
  if (rawFav) {
    try {
      const data = JSON.parse(rawFav);
      if (data && data.fav && data.fav.length > 0) {
        const favSongs = await fetchSongById(data.fav);
        if (favSongs) {
          setFav(favSongs);
        }
      }
    } catch (e) {
      console.error("Error loading favorites:", e);
    }
  }

  return 200; 
}

export function saveFavToLocalStorage(fav: Song[]) {
  if (!fav) return;
  const data = {
    fav: fav.map(song => song.id),
  };
  try {
    localStorage.setItem("Favorite", JSON.stringify(data));
  } catch (e) {
    console.error("Opse somthin not good!", e);
  }
}
