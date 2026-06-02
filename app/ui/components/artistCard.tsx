import Image from "next/image";
type props = {
  name: string;
  banner: string;
};

function ArtistCard({ name, banner }: props) {
  return (
    <div className="group hover:border-card-border flex w-48 flex-col items-center justify-center gap-2 rounded-lg shrink-0 snap-start border border-transparent p-2">
      <div className="relative w-40 aspect-square overflow-hidden rounded-full flex justify-end items-end">
        <Image
          src={banner}
          alt="Banner"
          fill
          sizes="180"
          className="object-cover"
        />
      </div>
      <div className="w-full px-1">
        <h3 className="truncate text-xl font-medium text-center">{name}</h3>
        <p className="text-secondary text-[15px] text-center">Artist</p>
      </div>
    </div>
  );
}

export default ArtistCard;
