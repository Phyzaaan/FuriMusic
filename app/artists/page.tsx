import dynamic from "next/dynamic";
import { Suspense } from "react";
import ArtistsSectionSkeleton from "./skeleton/ArtistsSkeleton";
const ArtistsStream = dynamic(() => import("./stream/ArtistsStream"))

export default function Artist() {
  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Artists Page</h1>
      </div>

      {/* Artists Section  */}
      <Suspense fallback={<ArtistsSectionSkeleton />}>
        <ArtistsStream />
      </Suspense>
    </main>
  );
}
