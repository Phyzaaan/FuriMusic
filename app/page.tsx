import ArtistsSection from "./sections/artist";
import SongsSection from "./sections/songsSection";
import { PlaylistsSection } from "./sections/playlistsSection";
import { fetchTopPlaylists, fetchTopSongs, fetchTopArtists } from "./data/data";

export default async function Home() {
  const data = await Promise.all([
    fetchTopPlaylists(),
    fetchTopArtists(),
    fetchTopSongs(),
  ]);
  const [Playlists, Artists, Songs] = data;

  return (
    <main className="flex w-full h-full flex-col overflow-y-auto no-scrollbar pt-22 pb-20">
      {/* Playlists Section  */}
      {Playlists && <PlaylistsSection 
        Playlists={Playlists}
      />}

      {/* Songs Section  */}
      {Songs && <SongsSection
      songs={Songs}
      />}

      {/* Artists Section  */}
      {Artists && <ArtistsSection 
      artists={Artists}
      />}
    </main>
  );
}
