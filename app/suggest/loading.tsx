export default function Loading() {
    return (
        <main className="no-scrollbar flex h-full w-full flex-col items-center gap-8 overflow-y-auto px-4 pb-20 pt-22">
            <section className="flex w-full max-w-5xl flex-col items-center gap-6 sm:p-8">
                <div className="flex w-full max-w-2xl flex-col items-center gap-3 text-center">
                    <div className="h-10 w-2/3 animate-pulse rounded bg-card-skelet sm:h-12" />
                    <div className="h-5 w-full max-w-xl animate-pulse rounded bg-card-skelet sm:h-6" />
                </div>

                <div className="flex w-full max-w-3xl flex-col gap-3 rounded-xl border border-card-border bg-dark-bg/70 p-3 sm:p-4">
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="h-12 w-full animate-pulse rounded-xl bg-card-skelet" />
                        <div className="h-10 w-full animate-pulse rounded-xl bg-card-skelet sm:h-12 sm:w-32" />
                    </div>
                    <div className="h-4 w-72 animate-pulse rounded bg-card-skelet" />
                </div>
            </section>

            <section className="flex w-full max-w-5xl flex-col gap-5 rounded-xl border border-card-border bg-card-bg/50 p-6 backdrop-blur-sm sm:p-8">
                <div className="flex items-center justify-between gap-3 border-b border-card-border pb-4">
                    <div className="flex flex-col gap-1">
                        <div className="h-3 w-28 animate-pulse rounded bg-card-skelet" />
                        <div className="h-9 w-32 animate-pulse rounded bg-card-skelet" />
                    </div>
                </div>

                <div className="grid gap-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-3 rounded-xl border border-card-border bg-white/3 p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                    <div className="h-6 w-6 animate-pulse rounded-md bg-card-skelet" />
                                </div>
                                <div className="h-5 w-24 animate-pulse rounded bg-card-skelet" />
                            </div>
                            <div className="h-4 w-full animate-pulse rounded bg-card-skelet" />
                            <div className="h-4 w-5/6 animate-pulse rounded bg-card-skelet" />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
