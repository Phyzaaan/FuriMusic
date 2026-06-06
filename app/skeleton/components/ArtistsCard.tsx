function ArtistCardSkeleton() {
  return (
    <div className="animate-pulse flex w-48 flex-col items-center justify-center gap-2 rounded-lg shrink-0 snap-start border border-transparent p-2">
      <div className="relative w-40 aspect-square overflow-hidden rounded-full bg-card-skelet flex justify-end items-end" />
      <div className="w-full px-1 flex flex-col items-center justify-center gap-2">
        <div className="h-6 w-4/5 rounded bg-card-skelet" />
        <div className="h-4 w-2/5 rounded bg-card-skelet/70" />
      </div>
    </div>
  );
}

export default ArtistCardSkeleton;
