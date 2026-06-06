export default function TitleSkeleton() {
    return (
        <div className="animate-pulse mt-4 flex w-full items-center justify-between px-2 py-1">
            <div className="h-10 w-1/3 rounded bg-card-skelet" />
            <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-md bg-card-skelet" />
                <div className="w-10 h-10 rounded-md bg-card-skelet" />
                <div className="w-16 h-8 rounded-md bg-card-skelet">
                </div>
            </div>
        </div>
    )
}