import ArtistCard from "../components/artistCard";
import { fetchAllArtists } from "../data/data";
import type { Artist } from "../data/type";


export default async function Artist() {
  const Artists = await fetchAllArtists();
  return (
    <main className="no-scrollbar flex h-full w-full flex-col overflow-y-auto pt-22 pb-20">
      {/* Title Section  */}
      <div className="my-2 flex w-full items-center justify-between px-2 py-1">
        <h1 className="text-3xl font-semibold">Artists Page</h1>
      </div>

      {/* Artists Section  */}
      <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
        {Artists.map(({id, banner, name}: Artist) => {
          return (
            <ArtistCard
              key={id}
              banner={banner}
              name={name}
            />
          );
        })}
      </div>
    </main>
  );
}
