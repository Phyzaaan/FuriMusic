import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PlaylistBody, PlaylistInfo } from "./sections/Playlist";
import { fetchPlaylistBody, fetchPlaylistInfo } from "@/app/utils/data/data";
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

    const [playlist, songs] = await Promise.all([
        fetchPlaylistInfo(id),
        fetchPlaylistBody(id),
    ]);

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <Suspense fallback={<PlaylistInfoSkeleton />}>
                {playlist && (
                    <PlaylistInfo
                        Playlist={playlist}
                        Songs={songs?.flat() ?? []}
                    />
                )}
            </Suspense>
            <Suspense fallback={<PlaylistBodySkeleton />}>
                {songs && <PlaylistBody Songs={songs.flat()} />}
            </Suspense>
        </main>
    );
}

