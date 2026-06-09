import { notFound } from "next/navigation";
import PlaylistPage from "./sections/Playlist";
import { fetchPlaylistBody, fetchPlaylistInfo } from "@/app/utils/data/data";
import ErrorMsg from "@/app/ui/components/Error";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function PlaylistByIdPage({ params }: Props) {
    const param = await params;
    const id = Number(param.id);
    if (Number.isNaN(id)) notFound();

    const [playlist, songs] = await Promise.all([
        fetchPlaylistInfo(id),
        fetchPlaylistBody(id),
    ]);
    if (!playlist || !songs) return <ErrorMsg>404 NOT FOUND</ErrorMsg>;
    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            <PlaylistPage Playlist={playlist} Songs={songs} />
        </main>
    );
}

