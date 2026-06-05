import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArtistInfoSkeleton, ArtistBodySkeleton } from "./skeleton/ArtistSkeleton";
import { ArtistInfoStream, ArtistBodyStream } from "./stream/ArtistStream";

type Props = {
    params: {
        id: number;
    };
}

export default async function ArtistByIdPage({ params }: Props) {
    const param = await params;
    const id = Number(param.id);
    if (Number.isNaN(id)) notFound();

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <Suspense fallback={<ArtistInfoSkeleton />}>
                <ArtistInfoStream id={id} />
            </Suspense>
            <Suspense fallback={<ArtistBodySkeleton />}>
                <ArtistBodyStream id={id} />
            </Suspense>
        </main>
    );
}

