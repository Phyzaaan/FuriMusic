import ArtistsSection from "./sections/artist";
import SongsSection from "./sections/songs";
import { PlaylistsSection } from "./sections/playlistsSection";
import Playlists from "./data/playlists"
import Artists from "./data/artists"

export default function Home() {
  const MyFav = Playlists.find((playlist) => playlist.id === "1")?.songs;
  return (
    <main className="flex w-full h-full flex-col overflow-y-auto no-scrollbar pt-22 pb-20">
      {/* Playlists Section  */}
      <PlaylistsSection 
        playlists={Playlists}
      />

      {/* Songs Section  */}
      <SongsSection
      songs={MyFav ? MyFav : []}
      />

      {/* Artists Section  */}
      <ArtistsSection 
      artists={Artists}
      />
    </main>
  );
}
