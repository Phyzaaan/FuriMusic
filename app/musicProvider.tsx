"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAudioInstance, pauseSong, playSong } from "./utils/libs/playSong";
import { handleNextSong, handlePrevSong } from "./utils/libs/changeSong";

import { Song } from "./utils/data/type";
import { MusicContextType } from "./utils/data/type";

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currTrack, setCurrTrack] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [fav, setFav] = useState<Song[]>([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    const audio = getAudioInstance();
    if (!audio) return;

    // Sync playing state
    const sync = () => setPlaying(!audio.paused);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);

    // Spacebar listener function
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        if (audio.paused) {
          playSong()
        } else {
          pauseSong()
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Media Session handlers
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", playSong);
      navigator.mediaSession.setActionHandler("pause", playSong);
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        handlePrevSong(currTrack, setCurrTrack, queue)
      );
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        handleNextSong(currTrack, setCurrTrack, queue)
      );
    }

    // CLEANUP EVERYTHING
    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      window.removeEventListener("keydown", handleKeyDown);

      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
      }
    };
  }, [currTrack, queue]);

  return (
    <MusicContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        currTrack,
        setCurrTrack,
        queue,
        setQueue,
        fav,
        setFav,
        currIndex,
        setCurrIndex,
        isPlaying,
        setPlaying,
      }}
    >
      <>{children}</>
    </MusicContext.Provider>
  );
}

const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

export default useMusic;
