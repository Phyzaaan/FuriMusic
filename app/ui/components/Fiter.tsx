"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { SORT_CONFIG, SORT_OPTIONS, Sort, SortTarget, } from "@/app/utils/libs/sort";

export default function PlaylistFilters({ current, target }: { current: Sort; target: SortTarget }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const setSort = (sort: Sort) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", sort);
        startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }));
    };

    return (
        <div ref={menuRef} className={`relative flex flex-col items-end p-2 ${isPending ? "opacity-70" : ""} z-20`}>
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-label="Open playlist filters"
                className="flex items-center gap-2 rounded-xl border border-card-border bg-dark-bg/70 px-3 py-2 text-sm font-medium text-secondary transition hover:border-white/20 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-from"
            >
                <span className="text-primary">{SORT_CONFIG[current].label}</span>
                <svg
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M5 7.5L10 12.5L15 7.5" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full z-20 w-58 rounded-xl border border-card-border bg-dark-bg/95 p-1.5 shadow-lg shadow-black/30 backdrop-blur-xl">
                    <div className="flex flex-col gap-1">
                        {SORT_OPTIONS[target].map((sort) => (
                            <button
                                key={sort}
                                type="button"
                                onClick={() => setSort(sort)}
                                aria-pressed={sort === current}
                                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${sort === current
                                    ? "bg-primary-gradient text-white shadow-[0_0_20px_rgba(102,126,234,0.35)]"
                                    : "text-secondary hover:bg-white/5 hover:text-primary"
                                    }`}
                            >
                                <span>{SORT_CONFIG[sort].label}</span>
                                {sort === current && (
                                    <span aria-hidden="true" className="text-xs font-semibold">
                                        ✓
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}