"use client";
import { useState, useRef, useEffect} from "react";
import SongsCard from "@/app/ui/components/songcard";
import useMusic from "@/app/musicProvider";
import { Song } from "@/app/utils/data/type";
import { loadMoreSongs } from "@/app/utils/data/clientData";

type SongsSectionProps = {
  songs: Song[];
};

export default function SongsSection({ songs }: SongsSectionProps) {
  const { setQueue } = useMusic();
  const [queue, setQueueState] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const [songsList, setSongsList] = useState(songs);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(songs.length);
  const [hasMore, setHasMore] = useState<boolean>(songs.length === 12);

  const handleQueue = () => {
    setQueue(songsList);
    setQueueState(true);
  }

  useEffect(() => {
    if (queue) {
      setQueue(songsList);
    }
  }, [queue, setQueue, songsList]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreSongs({
            loading,
            setLoading,
            hasMore,
            setHasMore,
            offset,
            setOffset,
            setSongsList,
          });
        }
      },
      { threshold: 1 }
    );

    observer.observe(target);

    // Clean up observer
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [songsList, hasMore, loading, offset, queue, setQueue]);

  return (
    <div className="no-scrollbar flex w-full flex-col gap-2 px-2 py-1">
      {songsList.map((song) => {
        return (
          <SongsCard
            key={song.id}
            id={song.id}
            name={song.name}
            artists={song.artists}
            duration={song.duration}
            banner={song.banner}
            url={song.url}
            handleQueue={handleQueue}
          />
        );
      })}
      {/* Load More Controller */}
      {hasMore && (
        <div ref={observerTarget} className="flex w-full items-center justify-center p-4">
          {loading && (
            <div className="animate-pulse text-secondary">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}
