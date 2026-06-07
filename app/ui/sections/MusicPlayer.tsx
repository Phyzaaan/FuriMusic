"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { getAudioInstance, pauseSong, playSong } from "../../utils/libs/playSong";
import {
  handleNextSong,
  handlePrevSong,
  handleShuffle,
} from "../../utils/libs/changeSong";
import ArtistLink from "../components/ArtistLink";
import formatTime from "../../utils/libs/formatTime";
import { dragStart, dragEnd, dragging, handleMouseMove } from "../../utils/libs/seek";
import MusicBar from "./MusicBar";
import { PrimaryBtn } from "../components/Buttons";
import QueueList from "./QueueList";
import useMusic from "../../musicProvider";
import { LoadLocalStorage, saveToLocalStorage, saveFavToLocalStorage } from "../../utils/libs/localStorage";
import Lyrics from "./Lyrics";


export default function MusicPlayer() {
  const { currTrack, setCurrTrack, queue, setQueue, isPlaying, setFav, fav } = useMusic();

  const isFav = useMemo(() => currTrack && fav.includes(currTrack), [currTrack, fav])
  const audioInstance = getAudioInstance();
  const lastTimeSave = useRef(0);

  const [currTime, setCurrTime] = useState(0.0);
  const [duration, setDuration] = useState(0);
  const [hoverPos, setHoverPos] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [showHover, setShowHover] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const lyricsSongId = currTrack?.id ?? null;
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (!audioInstance) return;
    LoadLocalStorage(setCurrTrack, audioInstance, setRepeat, setQueue, setFav);
  }, [setCurrTrack, audioInstance, setRepeat, setQueue, setFav]);
  
  useEffect(() => {
    if (!fav) return;
    saveFavToLocalStorage(fav);
  }, [fav]);

  useEffect(() => {
    const handleSave = () => {
      const now = Date.now();
      if (now - lastTimeSave.current >= 900) {
        saveToLocalStorage(currTime, currTrack, repeat, queue);
        lastTimeSave.current = now;
      }
    };

    audioInstance?.addEventListener("timeupdate", handleSave);
    return () => {
      audioInstance?.removeEventListener("timeupdate", handleSave);
    }
  }, [currTime, currTrack, repeat, audioInstance, queue]);

  useEffect(() => {
    const handleUpdate = () => {
      if (!audioInstance) return 0;
      setCurrTime(audioInstance.currentTime);
    };

    const handleLoad = () => {
      setDuration(audioInstance ? audioInstance.duration : 0);
    };

    const handleEnded = () => {
      if (repeat) {
        handleNextSong(currTrack, setCurrTrack, queue);
      } else {
        handleShuffle(setCurrTrack, queue);
      }
    };

    audioInstance?.addEventListener("timeupdate", handleUpdate);
    audioInstance?.addEventListener("loadedmetadata", handleLoad);
    audioInstance?.addEventListener("ended", handleEnded);

    return () => {
      audioInstance?.removeEventListener("timeupdate", handleUpdate);
      audioInstance?.removeEventListener("loadedmetadata", handleLoad);
      audioInstance?.removeEventListener("ended", handleEnded);
    };
  }, [audioInstance, currTrack, setCurrTime, setCurrTrack, queue, repeat]);


  return (
    <>
      {/* Full Screen Player Pop-up */}
      <div
        className={`bg-card-bg border-card-border fixed bottom-0 z-10 gap-1 flex max-h-[calc(100vh-81px)] w-full max-w-130 min-w-xs flex-col items-center overflow-hidden rounded-lg border px-2 py-2 shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300 ease-in-out ${showFullPlayer ? "bottom-0" : "bottom-[-110%]"
          }`}
      >
        {/* Top Header */}
        <div className="mb-8 flex w-full items-center justify-between">
          <PrimaryBtn
            onClick={() => setShowFullPlayer(false)}
            icon="/icons/arrow_forward.svg"
            className="rotate-90"
          />
        </div>


        {/* Album Art */}
        {(currTrack && !showLyrics) && (
          < div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={currTrack.banner}
              alt={currTrack.name}
              fill
              sizes="576"
              className="object-cover"
            />
          </div>
        )}
        {/* Bg Blur */}
        <div className="absolute top-8 -z-10 w-full aspect-square overflow-hidden rounded-lg blur-2xl">
          {currTrack && (
            <Image
              src={currTrack.banner}
              alt={currTrack.name}
              fill
              sizes="576"
              className="object-cover"
            />
          )}
        </div>
        {/* Lyrics Pop-up */}
        {showLyrics && (
          <div className="mb-4 flex w-full h-full flex-col overflow-hidden rounded-md border border-card-border bg-card-bg/70 backdrop-blur-md transition-all duration-200">
            <Lyrics songId={lyricsSongId} currTime={currTime} />
          </div>
        )}


        {/* Song Details */}
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-2">
          <div className="mx-2 mb-4 w-full">
            <h1 className="mb-1 truncate text-3xl font-bold">
              {currTrack?.name || "No Song Selected"}
            </h1>
            {currTrack ? <ArtistLink artists={currTrack.artists} /> : "Unknown Artist"}
          </div>
          <div className="flex w-full items-center justify-between">
            {/* Lyrics Button */}
            <PrimaryBtn
              onClick={() => setShowLyrics(!showLyrics)}
              icon={`/icons/lyrics.svg`}
              width={30}
              height={30}
            />

            {/* Favorite Button  */}
            <PrimaryBtn
              onClick={() => {
                if (isFav) {
                  setFav(fav.filter(song => song !== currTrack));
                  return;
                }
                if (currTrack)
                  setFav([...fav, currTrack])
              }}
              icon={`/icons/${isFav ? 'favorite' : 'close'}.svg`}
            />
          </div>
        </div>

        {/* Seekbar Area */}
        <div className="group relative mb-4 flex w-full min-h-2 flex-col items-center justify-center select-none">
          <div
            onMouseDown={dragStart}
            onMouseEnter={() => setShowHover(true)}
            onMouseMove={(e) => {
              dragging(e);
              handleMouseMove(e, setHoverPos, setHoverTime);
            }}
            onMouseLeave={(e) => {
              setShowHover(false);
              dragEnd(e);
            }}
            onMouseUp={dragEnd}
            onTouchStart={dragStart}
            onTouchMove={dragging}
            onTouchEnd={dragEnd}
            className="relative mb-2 h-1 w-full cursor-pointer rounded-full bg-white/20 group-hover:h-2"
          >
            <div
              style={{ width: `${(currTime / duration) * 100}%` }}
              className="bg-accent-gradient relative h-full rounded-full shadow-md"
            />
            <div
              style={{
                left: `${hoverPos}%`
              }}
              className={`bg-card-bg text-primary absolute bottom-4 -translate-x-4 ${showHover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} rounded-md px-1 text-center transition-transform duration-50`}
            >
              {formatTime(hoverTime)}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between px-1 text-sm opacity-60">
          <span>{formatTime(currTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Controls */}
        <div className="mb-2 flex w-full items-center justify-between px-2">

          {/* Play / Repeat Button */}
          <PrimaryBtn
            onClick={() => setRepeat(!repeat)}
            icon={`/icons/${repeat ? "repeat" : "shuffle"}.svg`}
          />
          {/* Prev Button */}
          <PrimaryBtn
            onClick={() =>
              repeat
                ? handlePrevSong(currTrack, setCurrTrack, queue)
                : handleShuffle(setCurrTrack, queue)
            }
            icon="/icons/skip_previous.svg"
            width={42}
            height={42}
          />

          {/* Play / Pause Button */}
          <PrimaryBtn
            onClick={() => {
              if (!isPlaying) {
                playSong();
              } else {
                pauseSong();
              }
            }}
            icon={`/icons/${isPlaying ? "pause" : "play_arrow"}.svg`}
            width={52}
            height={52}
          />

          {/* Next Song Button */}
          <PrimaryBtn
            onClick={() =>
              repeat
                ? handleNextSong(currTrack, setCurrTrack, queue)
                : handleShuffle(setCurrTrack, queue)
            }
            icon="/icons/skip_next.svg"
            width={42}
            height={42}
          />

          {/* Show PlayList Button */}
          <PrimaryBtn
            onClick={() => setShowPlaylist(true)}
            icon="/icons/queue_music.svg"
            className="lg:pointer-events-none lg:opacity-0"
          />
        </div>
      </div >

      {/* Mini Music Bar */}
      < MusicBar
        currTime={currTime}
        repeat={repeat}
        duration={duration}
        showFullPlayer={showFullPlayer}
        setShowFullPlayer={setShowFullPlayer}
      />
      {/* Play list Pop-up */}
      < QueueList showPlaylist={showPlaylist} setShowPlaylist={setShowPlaylist} />
    </>
  );
}
