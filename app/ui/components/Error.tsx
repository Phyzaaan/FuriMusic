import { SecondaryBtn } from "./Buttons";

export default function ErrorMsg({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div>{children}</div>
        </div>
    );
}

interface popUpProps {
    title: string;
    details: string;
    onClick: () => void;
    show: boolean;
}
export function PopUpMsg({ title, details, onClick, show }: popUpProps) {
    return (
        <div className={`absolute w-110 bg-card-bg p-2 border border-card-border rounded-lg backdrop-blur-sm flex flex-col items-center gap-5 transition-all ${show === null && 'scale-50 opacity-0'}`}>
            <h1 className="text-center text-xl font-semibold">{title}</h1>
            <p className="text-center text-lg">{details}</p>
            <SecondaryBtn onClick={onClick} className="w-1/2 text-2xl">OK</SecondaryBtn>
        </div>
    )
}