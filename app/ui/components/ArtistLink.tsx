import Link from "next/link";

interface ArtistLinkProps {
    artists: { id: number, name: string }[];
}

export default function ArtistLink({ artists }: ArtistLinkProps) {
    return (
        <p className="text-secondary w-full truncate text-[14px]">
            {artists.map((artist, index) => {
                const isLast = index === artists.length - 1;
                const isSecondLast = index === artists.length - 2;
                return (
                    <Link href={`/artists/${artist.id}`} key={artist.id} onClick={(e) => e.stopPropagation()} className="hover:underline cursor-pointer">
                        {isLast ? artist.name : `${artist.name}${isSecondLast ? " & " : ", "}`}
                    </Link>
                )
            })}
        </p>
    );
}