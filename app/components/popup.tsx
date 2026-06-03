import Image from "next/image";


type props = {
  showPopUp: boolean;
  children: React.ReactNode;
  className?: string;
};
function PopUp({ showPopUp, className, children }: props) {
  return (
    <div
      className={`absolute top-14 right-4 z-20 flex w-xs items-center justify-center rounded-lg px-1.5 py-2 backdrop-blur-md transition-all duration-300 ease-in-out ${showPopUp ? "translate-x-0 scale-100" : "pointer-events-none translate-x-100 scale-95"} ${className}`}
    >
      <div className="absolute inset-0 -z-10 h-full w-full rounded-md bg-black opacity-30" />
      <ul className="flex w-full list-none flex-col items-center justify-center gap-1 px-2">
        {children}
      </ul>
    </div>
  );
}

export default PopUp;

type PopUpLiProps = {
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string
};
export function PopUpLi({ className, children, icon, iconHeight = 24 ,iconWidth = 24, iconClassName }: PopUpLiProps) {
  return (
    <li
      className={`group text-primary flex w-full cursor-pointer items-center rounded-md py-2 pl-2 transition-all duration-200 hover:bg-(--accent) ${className}`}
    >
      {icon && <Image
        src={icon}
        alt="Svg"
        width={iconWidth}
        height={iconHeight}
        className={`mr-2 ${iconClassName}`}
      />}
      {children}
    </li>
  );
}
