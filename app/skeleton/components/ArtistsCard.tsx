function ArtistCardSkeleton() {
  return (
    <div className="group hover:border-card-border flex w-48 flex-col items-center justify-center gap-2 rounded-lg shrink-0 snap-start border border-transparent p-2">
      <div className="relative w-40 aspect-square overflow-hidden rounded-full flex justify-end items-end">
      </div>
      <div className="w-full px-1">
        <div className="truncate text-xl font-medium text-center"></div>
        <div className="text-secondary text-[15px] text-center"></div>
      </div>
    </div>
  );
}

export default ArtistCardSkeleton;
