"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchSongLyrics } from "@/app/utils/data/clientData";

type LyricLine = {
  time: number; // seconds
  text: string;
};

function parseTimestampedLyrics(lyricsText: string): LyricLine[] {
  if (!lyricsText) return [];

  const lines = lyricsText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const out: LyricLine[] = [];

  const tsRegex = /^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/;

  for (const raw of lines) {
    const match = raw.match(tsRegex);
    if (!match) continue;

    const mm = Number(match[1]);
    const ss = Number(match[2]);
    const text = match[3] ?? "";

    if (Number.isNaN(mm) || Number.isNaN(ss)) continue;

    out.push({ time: mm * 60 + ss, text });
  }

  // Ensure sorted by time (defensive)
  out.sort((a, b) => a.time - b.time);
  return out;
}

function findActiveLineIndex(lines: LyricLine[], t: number): number {
  // Choose the last line whose time <= t
  // If none, return 0.
  if (!lines.length) return -1;

  let min = 0;
  let max = lines.length - 1;
  let ans = 0;

  while (min <= max) {
    const mid = Math.floor((min + max) / 2);
    if (lines[mid].time <= t) {
      ans = mid;
      min = mid + 1;
    } else {
      max = mid - 1;
    }
  }

  return ans;
}

type LyricsProps = {
  songId: number | null;
  currTime: number;
};

export default function Lyrics({ songId, currTime }: LyricsProps) {
  const [lyricsText, setLyricsText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const parsed = useMemo(() => parseTimestampedLyrics(lyricsText), [lyricsText]);

  const activeIndex = useMemo(() => {
    if (!parsed.length) return -1;
    return findActiveLineIndex(parsed, currTime);
  }, [parsed, currTime]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!songId) {
        setLyricsText("");
        return;
      }

      setLoading(true);
      const text = await fetchSongLyrics(songId);
      if (cancelled) return;
      setLyricsText(text ?? "");
      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [songId]);

  useEffect(() => {
    if (activeIndex < 0) return;

    const el = lineRefs.current[activeIndex];
    const container = containerRef.current;
    if (!el || !container) return;

    // Scroll so active line stays near middle
    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    const elCenter = elRect.top - cRect.top + elRect.height / 2;
    const desired = cRect.height / 2;

    const delta = elCenter - desired;
    if (Math.abs(delta) < 8) return;

    container.scrollTop += delta;
  }, [activeIndex]);

  if (loading) {
    return (
      <div className="w-full flex-1 overflow-hidden">
        <div className="text-secondary  px-2 py-6 ">Loading lyrics...</div>
      </div>
    );
  }

  if (!lyricsText || !parsed.length) {
    return (
      <div className="w-full flex-1 overflow-hidden ">
        <div className="text-secondary px-2 py-6 ">No lyrics available.</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 overflow-y-auto overscroll-contain px-1 py-2"
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="mx-auto w-full max-w-130 px-1">
        {parsed.map((line, idx) => {
          const isActive = idx === activeIndex;

          return (
            <div
              key={`${line.time}-${idx}`}
              ref={(r) => {
                lineRefs.current[idx] = r;
              }}
              className={`px-3 py-1 text-center transition-all duration-150 select-none ${isActive
                  ? "text-primary font-semibold opacity-100"
                  : "text-secondary/90 opacity-80"
                } ${isActive ? "scale-[1.01]" : "scale-100"}`}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

