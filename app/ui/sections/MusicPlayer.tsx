"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { getAudioInstance, pauseSong, playSong } from "../../utils/libs/playSong";
import useSWR from "swr";
import { fetchSongLyrics } from "@/app/utils/data/data";
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
import Lyrics from "./Lyrics";
import SongEditor from "./SongEditor";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import { prewarmTrack } from "@/app/utils/libs/playerUtils";

export default function MusicPlayer() {
  const { currTrack, setCurrTrack, queue, repeat, setRepeat, isPlaying, setFav, fav, isAdmin } = useMusic();

  const isFav = useMemo(() => {
    return currTrack && fav.some(track => track.id === currTrack.id);
  }, [currTrack, fav]);

  const audioInstance = useMemo(() => {
    return getAudioInstance();
  }, []);

  const [currTime, setCurrTime] = useState(0.0);
  const [duration, setDuration] = useState(0);
  const [hoverPos, setHoverPos] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [showHover, setShowHover] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  const { data: lyricsText, isLoading } = useSWR<string | null>(
    currTrack?.id ? ["lyrics", currTrack.id] : null,
    async ([, id]: [string, number]) => {
      const lyrics = await fetchSongLyrics(id);
      return lyrics ?? null;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  const activeLyrics = lyricsText ?? currTrack?.lyrics;

  

  useEffect(() => {
    const handleUpdate = () => {
      if (!audioInstance) return 0;
      setCurrTime(audioInstance.currentTime);
    };

    const handleLoad = () => {
      setDuration(audioInstance ? audioInstance.duration : 0);
    };

    audioInstance?.addEventListener("timeupdate", handleUpdate);
    audioInstance?.addEventListener("loadedmetadata", handleLoad);

    return () => {
      audioInstance?.removeEventListener("timeupdate", handleUpdate);
      audioInstance?.removeEventListener("loadedmetadata", handleLoad);
    };
  }, [audioInstance, currTrack, setCurrTime,]);

  const playbackRef = useRef({ currTrack, queue, repeat });
  useEffect(() => {
    playbackRef.current = { currTrack, queue, repeat };
  }, [currTrack, queue, repeat]);

  // Pre fetch next song
  useEffect(() => {
    if (!currTrack || queue.length === 0) return;

    const currIndex = queue.findIndex((song) => song.id === currTrack.id);

    const nextIndex = (currIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];

    if (nextSong && !nextSong.blobUrl) {
      prewarmTrack(nextSong).then((localBlobUrl) => {
        if (localBlobUrl) {
          nextSong.blobUrl = localBlobUrl;
        }
      });
    }
  }, [currTrack, queue]);

  useEffect(() => {
    if (!audioInstance) return;

    const handleEnded = () => {
      const { currTrack: current, queue: currentQueue, repeat: isRepeat } = playbackRef.current;

      const isScreenOff = typeof document !== 'undefined' && document.hidden;

      if (isRepeat || isScreenOff) {
        handleNextSong(current, setCurrTrack, currentQueue);
      } else {
        handleShuffle(setCurrTrack, currentQueue);
      }
    };

    audioInstance.addEventListener("ended", handleEnded);

    return () => {
      audioInstance.removeEventListener("ended", handleEnded);
    };
  }, [audioInstance, setCurrTrack]);

  return (
    <>
      {/* Full Screen Player Pop-up */}
      <div
        className={`bg-card-bg border-card-border fixed z-10 gap-1 flex max-h-[calc(100vh-84px)] w-full max-w-130 min-w-xs flex-col items-center overflow-hidden rounded-lg border px-2 py-2 shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300 ease-in-out ${showFullPlayer ? "top-21 bottom-0" : "top-[110%] bottom-[-110%]"
          }`}
      >
        {/* Top Header */}
        <div className="mb-8 flex w-full items-center justify-between">
          <PrimaryBtn
            onClick={() => setShowFullPlayer(false)}
            icon="/icons/arrow_forward.svg"
            className="rotate-90"
          />
          {isAdmin &&
            <PrimaryBtn icon="/icons/edit.svg" onClick={() => setShowEditor(true)} width={24} height={24} />
          }
        </div>

        {currTrack && (
          <div className="relative mb-4 flex w-full aspect-square min-h-0 items-center justify-center">

            {/* Bg Glow */}
            <div className="absolute inset-0 -z-10 scale-110 blur-xl saturate-150">
              <Image
                src={currTrack.banner}
                alt={currTrack.name}
                fill
                sizes="576"
                className="object-cover rounded-lg"
              />
            </div>

            {/* Toggle: Album Art OR Lyrics */}
            {!showLyrics ? (
              <div className="relative z-10 h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={currTrack.banner}
                  alt={currTrack.name}
                  fill
                  sizes="576"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-md border border-card-border bg-card-bg/70 backdrop-blur-md transition-all duration-200">
                {isLoading && (
                  <div className="flex justify-center flex-1 w-full h-full overflow-hidden">
                    <div className="px-2 py-6 text-secondary">Loading lyrics...</div>
                  </div>
                )}
                <Lyrics lyricsText={activeLyrics} currTime={currTime} />
              </div>
            )}
          </div>
        )}


        {/* Song Details */}
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-2">
          <div className="mx-2 mb-4 w-full">
            <h1 className="mb-1 truncate text-3xl font-bold">
              {currTrack?.name || "No Song Selected"}
            </h1>
            {currTrack ? <ArtistLink onClick={() => setShowFullPlayer(false)} artists={currTrack.artists} /> : "Unknown Artist"}
          </div>
          <div className="flex w-full items-center justify-between">
            {/* Lyrics Button */}
            <PrimaryBtn
              onClick={() => setShowLyrics(!showLyrics)}
              icon={`/icons/lyrics.svg`}
              width={30}
              height={30}
              className={`border rounded-md p-0.5 ${showLyrics ? 'border-card-border bg-card-bg' : 'border-transparent '}`}
            />

            {/* Add To Playlist */}
            {isAdmin &&
              <PrimaryBtn
                onClick={() => setShowAddToPlaylist(true)}
                icon={`/icons/playlist_add.svg`}
                width={30}
                height={30}
                className={`border rounded-md p-0.5 ${showLyrics ? 'border-card-border bg-card-bg' : 'border-transparent '}`}
              />
            }


            {/* Favorite Button  */}
            <PrimaryBtn
              onClick={() => {
                if (!currTrack) return;
                if (isFav) {
                  setFav(fav.filter(song => (currTrack && song.id !== currTrack.id)));
                  return;
                }
                setFav([...fav, currTrack])
              }}
              icon={`/icons/${!isFav ? 'heart_plus' : 'heart_minus'}.svg`}
            />
          </div>
        </div>

        {/* Add to Playlist PopUp */}
        {(isAdmin && currTrack) && (
          <AddToPlaylistModal
            show={showAddToPlaylist}
            setShow={setShowAddToPlaylist}
            songId={currTrack.id}
          />
        )}

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

      {currTrack && (
        <SongEditor
          key={currTrack.id}
          Song={{ ...currTrack, lyrics: activeLyrics }}
          showEditor={showEditor}
          setShowEditor={setShowEditor}
        />
      )}
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
