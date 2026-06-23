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
    lyrics?: string;
}