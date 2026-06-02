import ArtistCard from "@/app/ui/components/artistCard";
import { Artist } from "@/app/utils/data/type";

type artistProps = {
  Artists: {
    id: number;
    name: string;
    banner: string;
  }[];
};

function ArtistsSection({ Artists }: artistProps) {
  return (
      <div className="no-scrollbar grid grid-cols-2 md:grid-cols-3 justify-items-center w-full gap-2 flex-wrap px-2 py-1">
        {Artists.map(({ id, banner, name }: Artist) => {
          return (
            <ArtistCard
              key={id}
              banner={banner}
              name={name}
            />
          );
        })}
      </div>
  );
}

export default ArtistsSection;
