'use client';
import { PrimaryBtn, SecondaryBtn } from "./buttons";
import Link from "next/link";

type titleProps = {
  children: React.ReactNode;
  link: string;
  handleScroll?: (value: boolean) => void;
};

function TitleBar({ children, link, handleScroll }: titleProps) {
  return (
    <div className="mt-4 flex w-full items-center justify-between px-2 py-1">
      <h1 className="text-3xl font-semibold">{children}</h1>
      <div className="flex items-center justify-between gap-2">
        <PrimaryBtn onClick={() => handleScroll? handleScroll(true) : ''} 
         icon="/icons/arrow_forward.svg" className="rotate-180" />
        <PrimaryBtn onClick={() => handleScroll? handleScroll(false) : ''}
        icon="/icons/arrow_forward.svg" />
        <Link href={link}>
        <SecondaryBtn
        
        >View All</SecondaryBtn>
        </Link>
      </div>
    </div>
  );
}

export default TitleBar;
