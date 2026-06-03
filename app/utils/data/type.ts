export type Song = {
  id: number;
  name: string;
  url: string;
  banner: string;
  duration: string;
  artists: string[];
  lyrics?: string;
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
  currIndex: number;
  setCurrIndex: (index: number) => void;
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
};