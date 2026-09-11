export default function Loading() {
    return (
        <main className="no-scrollbar mx-auto flex h-full w-full max-w-3xl flex-col gap-8 overflow-y-auto px-6 pb-20 pt-22">
            <div className="space-y-3 text-center">
                <div className="mx-auto h-10 w-2/3 animate-pulse rounded bg-card-skelet" />
                <div className="mx-auto h-5 w-1/2 animate-pulse rounded bg-card-skelet" />
            </div>

            <div className="rounded-lg border border-card-border bg-card-bg/50 p-4 shadow-lg">
                <div className="mb-2 h-6 w-1/3 animate-pulse rounded bg-card-skelet" />
                <div className="h-4 w-full animate-pulse rounded bg-card-skelet" />
                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-card-skelet" />
            </div>

            <div className="flex flex-col gap-2">
                <div className="h-7 w-2/3 animate-pulse rounded border-b border-card-border bg-card-skelet" />
                <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-8 w-24 animate-pulse rounded-md bg-card-skelet"
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="h-7 w-2/3 animate-pulse rounded border-b border-card-border bg-card-skelet" />
                <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex gap-2"
                        >
                            <div className="h-5 w-5 animate-pulse rounded bg-card-skelet" />
                            <div className="h-5 w-full animate-pulse rounded bg-card-skelet" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-card-border bg-card-bg/50 p-4"
                    >
                        <div className="mb-3 h-6 w-1/2 animate-pulse rounded bg-card-skelet" />
                        <div className="mb-2 h-4 w-full animate-pulse rounded bg-card-skelet" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-card-skelet" />
                    </div>
                ))}
            </div>
        </main>
    );
}
