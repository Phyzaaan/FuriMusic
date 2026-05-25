"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getAudioInstance, pauseSong, playSong } from "./libs/playSong";

type MusicContextType = {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  currSongId: string;
  setCurrSongId: (song: string) => void;
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currSongId, setCurrSongId] = useState("");
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    const audio = getAudioInstance();
    if (!audio) return;
    const sync = () => setPlaying(!audio.paused);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        if (audio.paused) {
          playSong();
        } else {
          pauseSong();
        }
      }
    });
    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
    };
  }, []);

  return (
    <MusicContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        currSongId,
        setCurrSongId,
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
