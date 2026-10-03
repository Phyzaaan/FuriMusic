import PlaylistsSection from "./sections/Playlists";
import PlaylistHeader from "./sections/Header";
import { parseSort } from "../utils/libs/sort";
import { fetchPlaylistsRange } from "../utils/data/data";
import ErrorMsg from "../ui/components/Error";

export default async function Playlist({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: string }>; // Promise in Next 15+, plain object in 14
}) {
  const sort = parseSort((await searchParams).sort, "playlists");
  const playlists = await fetchPlaylistsRange(25, 0, undefined, false, sort);
  if (!playlists || playlists.length === 0) return <ErrorMsg>404 NO Playlist Found</ErrorMsg>;

  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <PlaylistHeader sort={sort} />

      {/* Playlists Section  */}
        <PlaylistsSection key={sort} Playlists={playlists} sort={sort} />
    </main>
  );
}
