export const SORT_CONFIG = {
    oldest: { label: "Oldest", column: "created_at", ascending: true },
    recent: { label: "Recent", column: "created_at", ascending: false },
    alphabetical: { label: "A–Z", column: "name", ascending: true },
    deAlphabatic: { label: "Z–A", column: "name", ascending: false },
    leastSongs: { label: "Least songs", column: "song_count", ascending: true },
    mostSongs: { label: "Most songs", column: "song_count", ascending: false },
    shortest: { label: "Shortest", column: "duration_seconds", ascending: true },
    longest: { label: "Longest", column: "duration_seconds", ascending: false },
} as const;

export type Sort = keyof typeof SORT_CONFIG;

// Which sorts each page offers (the first one is the default)
export const SORT_OPTIONS = {
    playlists: ["recent", "oldest", "alphabetical", "deAlphabatic", "mostSongs", "leastSongs"],
    artists: ["recent", "oldest", "alphabetical", "deAlphabatic", "mostSongs", "leastSongs"],
    songs: ["recent", "oldest", "alphabetical", "deAlphabatic", "longest", "shortest"],
} as const satisfies Record<string, readonly Sort[]>;

export type SortTarget = keyof typeof SORT_OPTIONS;

export function parseSort(value: string | undefined, target: SortTarget): Sort {
    const allowed: readonly Sort[] = SORT_OPTIONS[target];
    return allowed.includes(value as Sort) ? (value as Sort) : allowed[0];
}