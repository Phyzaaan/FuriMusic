"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useMemo,
} from "react";
import { getAudioInstance, pauseSong, playSong } from "./utils/libs/playSong";
import { handleNextSong, handlePrevSong } from "./utils/libs/changeSong";
import { Song } from "./utils/data/type";
import { MusicContextType } from "./utils/data/type";
import { LoadLocalStorage, saveFavToLocalStorage, saveToLocalStorage } from "./utils/libs/localStorage";

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children, initialAdmin }: { children: ReactNode, initialAdmin: boolean }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currTrack, setCurrTrack] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [fav, setFav] = useState<Song[]>([]);
  const isLoaded = useRef(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isAdmin] = useState(initialAdmin);
  const currTrackRef = useRef<Song | null>(null);
  const queueRef = useRef<Song[]>([]);
  const [repeat, setRepeat] = useState(true);
  const lastTimeSave = useRef(0);

  const audio = useMemo(() => {
    return getAudioInstance();
  }, []);

  useEffect(() => {
    async function init() {
      if (!audio) return;
      const res = await LoadLocalStorage(setCurrTrack, audio, setRepeat, setQueue, setFav);
      console.log(res);
      isLoaded.current = true;
    }
    init();
  }, [setCurrTrack, audio, setRepeat, setQueue, setFav]);

  useEffect(() => {
    if (!isLoaded.current) return;
    saveFavToLocalStorage(fav);
  }, [fav]);

  useEffect(() => {
    if (!audio || !isLoaded.current) return;

    const handleSave = () => {
      const now = Date.now();
      if (now - lastTimeSave.current >= 900) {
        const time = audio.currentTime ?? 0;
        saveToLocalStorage(time, currTrack, repeat, queue);
        lastTimeSave.current = now;
      }
    };

    audio.addEventListener("timeupdate", handleSave);
    return () => {
      audio.removeEventListener("timeupdate", handleSave);
    };
  }, [audio, currTrack, repeat, queue]);

  useEffect(() => {
    currTrackRef.current = currTrack;
    queueRef.current = queue;
  }, [currTrack, queue]);

  useEffect(() => {
    if (!audio) return;

    // Sync playing state
    const sync = () => setPlaying(!audio.paused);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);

    // Spacebar listener function
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        if (audio.paused) {
          playSong();
        } else {
          pauseSong();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", playSong);
      navigator.mediaSession.setActionHandler("pause", pauseSong);
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        handlePrevSong(currTrackRef.current, setCurrTrack, queueRef.current)
      );
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        handleNextSong(currTrackRef.current, setCurrTrack, queueRef.current)
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
  }, [audio, currTrack, queue]);

  return (
    <MusicContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        currTrack,
        setCurrTrack,
        queue,
        setQueue,
        repeat,
        setRepeat,
        fav,
        setFav,
        isPlaying,
        setPlaying,
        isAdmin,
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
