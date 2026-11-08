import { loadSong } from "./playSong";
import { Song } from "../data/type";
import { furiLog } from "./debug";

export function handleNextSong(
  currTrack: Song | null,
  setCurrTrack: (track: Song | null) => void,
  queue: Song[],
) {
  if (queue.length === 0) return;
  const currIndex = queue.findIndex((song) => song.id === currTrack?.id);
  const nextIndex = (currIndex + 1) % queue.length;

  const nextSong = queue[nextIndex];

  furiLog("track-selected", {
    name: nextSong.name,
    source: nextSong.blobUrl ? "blob" : "supabase",
  });

  loadSong(nextSong, true);

  setCurrTrack(nextSong);
}

export function handlePrevSong(
  currTrack: Song | null,
  setCurrTrack: (track: Song | null) => void,
  queue: Song[],
) {
  if (queue.length === 0) return;
  const currIndex = queue.findIndex((song) => song.id === currTrack?.id);
  const prevIndex = currIndex === 0 ? queue.length - 1 : currIndex - 1;

  const prevSong = queue[prevIndex];

  loadSong(prevSong, true);

  setCurrTrack(prevSong);
}

export function handleShuffle(
  setCurrTrack: (track: Song | null) => void,
  queue: Song[],
) {
  if (queue.length === 0) return;
  const randomIndex = Math.floor(Math.random() * queue.length);
  loadSong(queue[randomIndex], true);

  setCurrTrack(queue[randomIndex]);
}
