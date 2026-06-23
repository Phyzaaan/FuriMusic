'use client';
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type navProps = {
  links: {
    icon: string;
    name: string;
    href: string;
  }[];
};

function NavMenu({ links }: navProps) {
  const pathname = usePathname();
  return (
    <nav className="flex w-full list-none flex-col items-center justify-center gap-1 py-3">
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`w-11/12 cursor-pointer border flex gap-2 ${pathname === link.href ? "border-card-border bg-card-bg shadow-lg" : "border-transparent"} text-primary hover:border-card-border flex items-center rounded-md py-2 pl-2 transition-all`}
          >
            <Image
              src={`/icons/${link.icon}.svg`}
              alt={link.name}
              width={24}
              height={24}
              className="mr-2"
            />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default NavMenu;
