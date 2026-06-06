import ArtistCard from "@/app/ui/components/ArtistCard";
import { Artist } from "@/app/utils/data/type";

type artistProps = {
  Artists: Artist[];
};

function AllArtistsSection({ Artists }: artistProps) {
  return (
    <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
      {Artists.length > 0 ? (Artists.map(({ id, banner, name }: Artist) => {
        return (
          <ArtistCard
            key={id}
            id={id}
            banner={banner}
            name={name}
          />
        );
      })) : (
      <h1 className="w-full text-center mx-auto my-auto col-span-full">There is Nothing</h1>
      )}
    </div>
  );
}

export default AllArtistsSection;
