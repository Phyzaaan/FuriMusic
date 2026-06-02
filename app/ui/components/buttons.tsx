"use client";
import Image from "next/image";

type SecondaryBtnProps = {
  onClick?: () => void;
  icon?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
};

export function SecondaryBtn({
  onClick,
  icon,
  children = "",
  width = 24,
  height = 24,
}: SecondaryBtnProps) {
  return (
    <button
      onClick={onClick}
      className="bg-bg-card-bg text-primary border-card-border flex cursor-pointer items-center justify-center rounded-md border py-1 pr-2 pl-1 transition-all duration-150 hover:bg-(--primary-from) active:scale-100"
    >
      {icon && <Image src={icon} alt="Play" width={width} height={height} />}
      {children}
    </button>
  );
}

type PrimaryBtnProps = {
  onClick?: () => void;
  icon: string;
  className?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  alt?: string;
};

export function PrimaryBtn({
  onClick,
  icon,
  className = "",
  children,
  width = 32,
  height = 32,
  alt = "icon",
}: PrimaryBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`hover:drop-shadow-glow cursor-pointer transition-all duration-150 hover:scale-110 active:scale-100 ${className}`}
    >
      {icon && <Image src={icon} alt={alt} width={width} height={height} />}
      {children}
    </button>
  );
}
