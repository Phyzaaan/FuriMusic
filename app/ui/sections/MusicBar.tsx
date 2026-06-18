import { pauseSong, playSong } from "../../utils/libs/playSong";
import {
  handleNextSong,
  handlePrevSong,
  handleShuffle,
} from "../../utils/libs/changeSong";
import formatArtists from "@/app/utils/libs/formatArtists";
import formatTime from "../../utils/libs/formatTime";
import { dragStart, dragEnd, dragging, handleMouseMove } from "../../utils/libs/seek";
import { PrimaryBtn } from "../components/Buttons";
import useMusic from "../../musicProvider";
import { useState } from "react";

type Props = {
  currTime: number;
  duration: number;
  showFullPlayer: boolean;
  repeat: boolean;
  setShowFullPlayer: (value: boolean) => void;
};

export default function MusicBar({
  currTime,
  duration,
  showFullPlayer,
  repeat,
  setShowFullPlayer,
}: Props) {
  const { currTrack, isPlaying, setCurrTrack, queue } = useMusic();

  const [hoverPos, setHoverPos] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [showHover, setShowHover] = useState(false);

  return (
    /* Mini Player Sticky Bar */
    <section
      className={`bg-card-bg border-card-border fixed ${!showFullPlayer && currTrack ? "bottom-0" : "bottom-[-110%]"} items-between z-10 flex w-full max-w-150 flex-row justify-center rounded-t-xl border-t border-r border-l px-4 py-1 pt-4 pb-[env(safe-area-inset-bottom)] shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300`}
    >
      {/* Seekbar */}
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
        className="group absolute -top-2 flex h-7 w-full flex-col items-center justify-between gap-1 px-3 py-2 pb-2 select-none"
      >
        <div className="flex h-0.5 w-full items-center rounded-full bg-white/20">
          <div
            style={{ width: `${Math.floor((currTime / duration) * 100)}%` }}
            className={`bg-primary-gradient h-0.5 rounded-full`}
          ></div>
          <div
            style={{ left: `${Math.floor((currTime / duration) * 100)}%` }}
            className={`bg-primary-gradient absolute h-3 w-3 rounded-full opacity-0 group-hover:opacity-100`}
          ></div>
          <div
            style={{ left: `${hoverPos}%`, opacity: `${showHover ? 1 : 0}` }}
            className="bg-card-bg text-primary absolute -top-8 -translate-x-4 rounded-md px-1 text-center transition-opacity duration-50"
          >
            {formatTime(hoverTime)}
          </div>
        </div>
        {/* Duration  */}
        <div className="flex w-full justify-between text-xs">
          <span>{formatTime(currTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Song Info */}
      <div
        onClick={() => setShowFullPlayer(true)}
        className="flex w-full max-w-[60%] cursor-pointer flex-col items-center justify-center transition-opacity hover:opacity-90 sm:max-w-[70%]">
        <h2 className="w-full truncate text-xl font-semibold">
          {currTrack?.name}
        </h2>
        <p className="text-secondary w-full truncate text-[14px]">
          {currTrack ? formatArtists(currTrack.artists.map(artist => artist.name)) : "Unknown Artist"}
        </p>
      </div>

      {/* Controls */}
      <div className="my-2 flex w-full max-w-3xs items-center justify-around">
        <PrimaryBtn
          onClick={() =>
            repeat
              ? handlePrevSong(currTrack, setCurrTrack, queue)
              : handleShuffle(setCurrTrack, queue)
          }
          icon="/icons/skip_previous.svg"
        />
        <PrimaryBtn
          onClick={() => {
            if (!isPlaying) {
              playSong();
            } else {
              pauseSong();
            }
          }}
          icon={`/icons/${isPlaying ? "pause_circle.svg" : "play_circle.svg"}`}
          width={42}
          height={42}
        />
        <PrimaryBtn
          onClick={() =>
            repeat
              ? handleNextSong(currTrack, setCurrTrack, queue)
              : handleShuffle(setCurrTrack, queue)
          }
          icon="/icons/skip_next.svg"
        />
      </div>
    </section>
  );
}
