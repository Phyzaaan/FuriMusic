"use client";
import { useEffect, useState, useRef } from "react";
import Songs from "../data/songs";
import Image from "next/image";
import { getAudioInstance, pauseSong, playSong } from "../libs/playSong";
import PopUp from "../components/popup";
import {
  handleNextSong,
  handlePrevSong,
  handleShuffle,
} from "../libs/changeSong";
import formatTime from "../libs/formatTime";
import { dragStart, dragEnd, dragging, handleMouseMove } from "../libs/seek";
import MusicBar from "./musicbar";
import { PrimaryBtn } from "../components/buttons";
import Playlist from "./playlist";
import useMusic from "../musicProvider";
import { LoadLocalStorage, saveToLocalStorage } from "../libs/localStorage";

export default function MusicPlayer() {
  const { currSongId, setCurrSongId, isPlaying } = useMusic();

  const currSong = Songs.find((song) => song.id === currSongId);
  const audioInstance = getAudioInstance();
  const lastTimeSave = useRef(0);

  const [currTime, setCurrTime] = useState(0.0);
  const [duration, setDuration] = useState(0);
  const [hoverPos, setHoverPos] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [showHover, setShowHover] = useState(false);
  const [isFav, setFav] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showSavePlaylist, setShowSavePlaylist] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (!audioInstance) return;
    LoadLocalStorage(setCurrSongId, audioInstance);
  }, [setCurrSongId, audioInstance]);

  useEffect(() => {
    const handleUpdate = () => {
      if (!audioInstance) return 0;
      setCurrTime(audioInstance.currentTime);
    };

    const handleSave = () => {
      const now = Date.now();
      if (now - lastTimeSave.current >= 900) {
        saveToLocalStorage(currTime, currSongId);
        lastTimeSave.current = now;
      }
    };

    const handleLoad = () => {
      setDuration(audioInstance ? audioInstance.duration : 0);
    };

    const handleEnded = () => {
      if (repeat) {
        handleNextSong(currSongId, setCurrSongId);
      } else {
        handleShuffle(setCurrSongId);
      }
    };

    audioInstance?.addEventListener("timeupdate", handleUpdate);
    audioInstance?.addEventListener("timeupdate", handleSave);
    audioInstance?.addEventListener("loadedmetadata", handleLoad);
    audioInstance?.addEventListener("ended", handleEnded);

    return () => {
      audioInstance?.removeEventListener("timeupdate", handleUpdate);
      audioInstance?.removeEventListener("timeupdate", handleSave);
      audioInstance?.removeEventListener("loadedmetadata", handleLoad);
      audioInstance?.removeEventListener("ended", handleEnded);
    };
  }, [currTime, audioInstance, currSongId, setCurrSongId, repeat]);

  return (
    <>
      {/* Full Screen Player Pop-up */}
      <div
        className={`bg-card-bg border-card-border fixed top-20 bottom-0 z-10 flex max-h-[calc(100vh-80px)] w-full max-w-150 min-w-xs flex-col items-center overflow-hidden rounded-lg border px-4 py-4 shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          showFullPlayer ? "top-18" : "top-[110%]"
        }`}
      >
        {/* Top Header */}
        <div className="mb-8 flex w-full items-center justify-between">
          <PrimaryBtn
            onClick={() => setShowFullPlayer(false)}
            icon="/icons/arrow_forward.svg"
            className="rotate-90"
          />
          <PrimaryBtn
            onClick={() => setShowDropDown(!showDropDown)}
            icon={`/icons/${showDropDown ? "close" : "more_vert"}.svg`}
            width={30}
            height={28}
          />
        </div>

        {/* Drop Down Menu */}
        {/* <div
          className={`absolute top-14 right-4 z-20 flex w-xs items-center justify-center rounded-lg px-1.5 py-2 backdrop-blur-md transition-all duration-300 ease-in-out ${showDropDown ? "translate-x-0 scale-100" : "pointer-events-none translate-x-100 scale-95"} `}
        >
          <div className="absolute inset-0 -z-10 h-full w-full rounded-md bg-black opacity-30" />
          <ul className="flex w-full list-none flex-col items-center justify-center gap-1 px-2">
            <li
              className={`group text-primary flex w-full cursor-pointer items-center rounded-md py-2 pl-2 transition-all duration-200 hover:bg-(--accent)`}
            >
              <Image
                src={"/icons/playlist_add.svg"}
                alt="Svg"
                width={24}
                height={24}
                className="mr-2"
              />
              Save to Playlist
            </li>
          </ul>
        </div> */}

        {/* Album Art */}
        <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
          {currSong && (
            <Image
              src={`/SongsBanner/${currSong.banner}`}
              alt={currSong.name}
              fill
              sizes="576"
              className="object-cover"
            />
          )}
        </div>
        {/* Bg Blur */}
        <div className="absolute top-12 -z-10 h-[65%] w-full overflow-hidden rounded-lg blur-2xl">
          {currSong && (
            <Image
              src={`/SongsBanner/${currSong.banner}`}
              alt={currSong.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Song Details */}
        <div className="mb-4 flex w-full flex-col items-center justify-between">
          <div className="mx-2 mb-4 w-full">
            <h1 className="mb-1 truncate text-3xl font-bold">
              {currSong?.name || "No Song Selected"}
            </h1>
            <p className="text-secondary truncate text-xl">
              {currSong?.artist || "Unknown Artist"}
            </p>
          </div>
          <div className="flex w-full items-center justify-between">
            <PrimaryBtn
              onClick={() => setShowLyrics(!showLyrics)}
              icon={`/icons/lyrics.svg`}
              width={30}
              height={30}
            />

            <PrimaryBtn
              onClick={() => setFav(!isFav)}
              icon={`/icons/favorite.svg`}
            />

            <PrimaryBtn
              onClick={() => setShowSavePlaylist(!showSavePlaylist)}
              icon={`/icons/${showSavePlaylist ? 'close' : 'bookmark_add'}.svg`}
            />
          </div>
        </div>

        <PopUp 
          showPopUp={showSavePlaylist}
          className="bottom-50 top-auto"
        >
         Hello
        </PopUp>

        {/* Seekbar Area */}
        <div className="group relative mb-4 flex min-h-10 w-full flex-col items-center justify-center select-none">
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
                left: `${hoverPos}%`,
                opacity: `${showHover ? 1 : 0}`,
              }}
              className="bg-card-bg text-primary absolute bottom-4 -translate-x-4 rounded-md px-1 text-center transition-opacity duration-50"
            >
              {formatTime(hoverTime)}
            </div>
          </div>
          <div className="absolute bottom-0 flex w-full justify-between px-1 text-sm opacity-60">
            <span>{formatTime(currTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="my-2 flex w-full items-center justify-between px-2">
          {/* Play / Repeat Button */}
          <PrimaryBtn
            onClick={() => setRepeat(!repeat)}
            icon={`/icons/${repeat ? "repeat" : "shuffle"}.svg`}
          />
          {/* Prev Button */}
          <PrimaryBtn
            onClick={() =>
              repeat
                ? handlePrevSong(currSongId, setCurrSongId)
                : handleShuffle(setCurrSongId)
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
                ? handleNextSong(currSongId, setCurrSongId)
                : handleShuffle(setCurrSongId)
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
      </div>

      {/* Mini Music Bar */}
      <MusicBar
        currTime={currTime}
        repeat={repeat}
        duration={duration}
        showFullPlayer={showFullPlayer}
        setShowFullPlayer={setShowFullPlayer}
      />
      {/* Play list Pop-up */}
      <Playlist showPlaylist={showPlaylist} setShowPlaylist={setShowPlaylist} />
    </>
  );
}
