import { notFound } from "next/navigation";
import ArtistPage from "./sections/Artist";
import ErrorMsg from "@/app/ui/components/Error";
import { fetchArtistInfo, fetchArtistBody } from "@/app/utils/data/data";

type Props = {
    params: Promise<{
        id: number;
    }>;
}

export default async function ArtistByIdPage({ params }: Props) {
    const param = await params;
    const id = Number(param.id);
    if (Number.isNaN(id)) notFound();
    const [artist, songs] = await Promise.all([
        fetchArtistInfo(id),
        fetchArtistBody(id),
    ]);
    if (!artist || !songs) return <ErrorMsg>404 NOT FOUND</ErrorMsg>;

    return (
        <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
            {(artist && songs) && (
                <ArtistPage Artist={artist} Songs={songs} />
            )}
        </main>
    );
}

