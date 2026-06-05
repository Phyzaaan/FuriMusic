import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArtistInfoSkeleton, ArtistBodySkeleton } from "./skeleton/ArtistSkeleton";
import { ArtistBody, ArtistInfo } from "./sections/Artist";
import { fetchArtistInfo, fetchArtistBody } from "@/app/utils/data/data";

type Props = {
    params: {
        id: number;
    };
}

export default async function ArtistByIdPage({ params }: Props) {
    const param = await params;
    const id = Number(param.id);
    if (Number.isNaN(id)) notFound();
    const [artist, songs] = await Promise.all([
        fetchArtistInfo(id),
        fetchArtistBody(id),
    ]);

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <Suspense fallback={<ArtistInfoSkeleton />}>
                {artist && <ArtistInfo Artist={artist} Songs={songs?.flat() ?? []} />}
            </Suspense>
            <Suspense fallback={<ArtistBodySkeleton />}>
                {songs && <ArtistBody Songs={songs.flat()} />}
            </Suspense>
        </main>
    );
}

