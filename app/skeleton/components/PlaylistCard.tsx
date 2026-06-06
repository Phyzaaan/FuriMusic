const PlaylistCardSkeleton = () => {
  return (
    <div className="animate-pulse group w-52 flex flex-col shrink-0 snap-start items-center justify-center gap-2 rounded-lg border border-transparent p-2">
      <div className="relative w-full h-40 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-card-skelet opacity-80" />
        {/* <div className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card-skelet/60" /> */}
      </div>

      <div className="w-full px-1 flex flex-col items-start justify-center gap-2">
        <div className="h-6 w-4/5 rounded bg-card-skelet" />
        <div className="h-4 w-2/5 rounded bg-card-skelet/70" />
      </div>
    </div>
  );
};

export default PlaylistCardSkeleton;

