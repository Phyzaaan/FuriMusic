import Artists from "../data/artists";
import ArtistCard from "../components/artistCard";

export default function Artist() {
  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Artists Page</h1>
      </div>

      {/* Artists Section  */}
      <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
        {Artists.map((artist) => {
          return (
            <ArtistCard
              key={artist.id}
              banner={artist.image}
              name={artist.name}
              tracks={artist.songs.length}
            />
          );
        })}
      </div>
    </main>
  );
}
