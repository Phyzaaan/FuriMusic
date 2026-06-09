import ArtistCard from "@/app/ui/components/ArtistCard";
import { Artist } from "@/app/utils/data/type";
import ErrorMsg from "@/app/ui/components/Error";

type artistProps = {
  Artists: Artist[] | undefined;
};

function AllArtistsSection({ Artists }: artistProps) {
  return (
    <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
      {Artists && Artists.length > 0 ? (Artists.map(({ id, banner, name }: Artist) => {
        return (
          <ArtistCard
            key={id}
            id={id}
            banner={banner}
            name={name}
          />
        );
      })) : (
      <ErrorMsg>There is NOTING!</ErrorMsg>
      )}
    </div>
  );
}

export default AllArtistsSection;
