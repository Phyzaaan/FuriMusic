export type Song = {
  id: number;
  name: string;
  url: string;
  banner: string;
  duration: string;
  artists: { id: number; name: string }[];
  lyrics?: string | null | undefined;
  blobUrl?: string;
};


export type suggestionSong = {
  id: number;
  name: string;
  url: string;
  banner: string;
  duration: string;
  artists: { id: number; name: string }[];
  pendingArtists: { name: string; banner: string; }[];
  lyrics?: string | null | undefined;
};


export type SongEditorSource = "songs" | "suggestions" | "new";

export type SuggestionPayload = {
  name: string;
  duration: string;
  lyrics: string;
  url: string;
  // Song banner in Suggestions can be null (no banner provided)
  banner: string | null;
  existing_artists: number[];
  new_artists: {
    name: string;
    // New artist banner can be null if no banner was provided
    banner: string | null;
  }[];
};


export type Playlist = {
  id: number;
  name: string;
  banner: string;
  totalSongs: number;
};

export type Artist = {
  id: number;
  name: string;
  banner: string;
};

export type MusicContextType = {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  currTrack: Song | null;
  setCurrTrack: (track: Song | null) => void;
  queue: Song[];
  setQueue: (queue: Song[]) => void;
  repeat: boolean;
  setRepeat: (value: boolean) => void;
  fav: Song[];
  setFav: (fav: Song[]) => void;
  isPlaying: boolean;
  setPlaying: (value: boolean) => void;
  isAdmin: boolean;
};

export type song = {
  id: number;
  name: string;
  url: string;
  banner: string;
  duration: string;
  artists: {
    name: string;
    banner: string;
  }[];
  lyrics?: string;
}

export type songDetails = {
  name: string;
  banner: string;
  url: string;
  duration: string;
  artist_name: string;
  artist_banner: string;
}