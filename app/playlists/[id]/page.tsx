import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PlaylistInfoStream, PlaylistBodyStream } from "./stream/PlaylistStream";
import { PlaylistBodySkeleton, PlaylistInfoSkeleton } from "./skeleton/PlaylistSkeleton";

type Props = {
    params: {
        id: string;
    };
};

export default async function PlaylistByIdPage({ params }: Props) {
    const param = await params;
    const id = Number(param.id);
    if (Number.isNaN(id)) notFound();

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <Suspense fallback={<PlaylistInfoSkeleton />}>
                <PlaylistInfoStream id={id} />
            </Suspense>
            <Suspense fallback={<PlaylistBodySkeleton />}>
                <PlaylistBodyStream id={id} />
            </Suspense>
        </main>
    );
}

