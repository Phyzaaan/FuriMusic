export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col items-center gap-8 overflow-y-auto px-4 pb-20 pt-22">
            <div className="max-w-lg space-y-3 text-center">
                <div className="mx-auto h-10 w-2/3 animate-pulse rounded bg-card-skelet" />
                <div className="mx-auto h-5 w-full animate-pulse rounded bg-card-skelet" />
            </div>

            <div className="flex w-full max-w-2xl flex-col items-center gap-3">
                <div className="flex w-full items-center justify-center gap-2">
                    <div className="h-12 w-1/2 animate-pulse rounded-lg bg-card-skelet" />
                    <div className="h-12 w-32 animate-pulse rounded-lg bg-card-skelet" />
                </div>
                <div className="h-4 w-72 animate-pulse rounded bg-card-skelet" />
            </div>

            <div className="flex w-full max-w-2xl flex-col items-center gap-4">
                <div className="h-px w-full bg-card-border" />
                <div className="h-9 w-2/3 animate-pulse rounded bg-card-skelet" />

                <div className="mt-4 grid w-full gap-4 md:w-3/4">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-card-border bg-white/5 p-4"
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <div className="h-8 w-8 animate-pulse rounded-md bg-card-skelet" />
                                <div className="h-5 w-24 animate-pulse rounded bg-card-skelet" />
                            </div>
                            <div className="h-4 w-full animate-pulse rounded bg-card-skelet" />
                            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-card-skelet" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
