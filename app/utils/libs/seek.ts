let isDragging = false;
import { getAudioInstance, pauseSong, playSong } from "./playSong";

const audio = getAudioInstance();
let rect: DOMRect;
export function handleMouseMove(
  e: React.MouseEvent,
  setHoverPos: (time: number) => void,
  setHoverTime: (time: number) => void,
) {
  const seekbar = e.currentTarget;
  const rect = seekbar.getBoundingClientRect();

  const clientX = (e as React.MouseEvent).clientX;

  const offsetX = clientX - rect.left;

  const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
  if (audio) {
    setHoverPos(percentage * 100);
    setHoverTime(percentage * audio.duration);
  }
  return 0;
}

export function updateCurrTime(e: React.MouseEvent | React.TouchEvent) {

  let clientX: number;
  if ("touches" in e) {
    clientX = e.touches[0]
      ? e.touches[0].clientX
      : (e as React.TouchEvent).changedTouches[0].clientX;
  } else {
    clientX = (e as React.MouseEvent).clientX;
  }

  const offsetX = clientX - rect.left;

  const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
  if (audio && audio.duration) {
    audio.currentTime = percentage * audio.duration;
  }
}

export function dragStart(e: React.MouseEvent | React.TouchEvent) {
  isDragging = true;
  const seekbar = e.currentTarget;
  rect = seekbar.getBoundingClientRect();
  updateCurrTime(e);
  pauseSong();
}

export function dragging(e: React.MouseEvent | React.TouchEvent) {
  if (isDragging) {
    updateCurrTime(e);
  }
}

export function dragEnd(e: React.MouseEvent | React.TouchEvent) {
  if (isDragging) {
    updateCurrTime(e);
    playSong();
    isDragging = false;
  }
}
