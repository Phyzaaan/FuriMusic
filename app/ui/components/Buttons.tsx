"use client";
import Image from "next/image";

type SecondaryBtnProps = {
  onClick?: () => void;
  icon?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean
};

export function SecondaryBtn({
  onClick,
  icon,
  children = "",
  width = 24,
  height = 24,
  className = '',
  type,
  disabled,
}: SecondaryBtnProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`bg-bg-card-bg text-primary border-card-border flex cursor-pointer items-center justify-center rounded-md border py-1 px-2 transition-all duration-150 hover:bg-(--primary-from) active:scale-110 ${className}`}
    >
      {icon && <Image src={icon} alt="Play" width={width} height={height} />}
      {children}
    </button>
  );
}

type PrimaryBtnProps = {
  onClick?: () => void;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  alt?: string;
  type?: "button" | "submit" | "reset" | undefined;
};

export function PrimaryBtn({
  onClick,
  icon,
  className = "",
  children,
  width = 32,
  height = 32,
  alt = "icon",
  type
}: PrimaryBtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`hover:drop-shadow-glow cursor-pointer transition-all duration-150 hover:scale-110 active:scale-100 ${className}`}
    >
      {icon && <Image src={icon} alt={alt} width={width} height={height} />}
      {children}
    </button>
  );
}