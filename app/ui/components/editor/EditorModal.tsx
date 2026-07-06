import { PrimaryBtn } from "@/app/ui/components/Buttons";
import type { ReactNode } from "react";

interface EditorModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
}

export default function EditorModal({ title, onClose, children, footer }: EditorModalProps) {
    return (
        <div className="absolute z-50 top-21 mx-auto w-full max-w-2xl flex flex-col max-h-[calc(100vh-81px)] bg-card-bg border border-card-border rounded-lg shadow-2xl backdrop-blur-2xl overflow-hidden text-primary">
            <div className="px-4 py-2 border-b border-card-border bg-dark-bg flex justify-between items-center">
                <h1 className="text-2xl font-black tracking-tight text-primary">{title}</h1>
                <PrimaryBtn
                    type="button"
                    icon="/icons/close.svg"
                    width={24}
                    height={24}
                    onClick={onClose}
                />
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-1 flex flex-col gap-2 no-scrollbar">
                {children}
            </div>

            {footer ? <div className="px-2 py-2 border-t border-card-border">{footer}</div> : null}
        </div>
    );
}
