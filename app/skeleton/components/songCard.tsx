export default function SongsCardSkeleton() {
  return (
    <li className="animate-pulse group w-full max-h-15 min-w-0 flex-1 rounded-md border border-transparent px-2 py-1.5 flex items-center justify-between gap-3">
      <div className="relative flex h-12 w-14 items-center justify-center rounded-md">
        <div className="absolute inset-0 rounded-md bg-card-bg/80" />
        <div className="bg-card-bg absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-md opacity-70" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-start">
        <div className="h-4 w-4/5 rounded bg-card-bg" />
        <div className="mt-2 h-3 w-3/5 rounded bg-card-bg/70" />
      </div>

      <div className="h-4 w-14 rounded bg-card-bg/70" />
    </li>
  );
}

