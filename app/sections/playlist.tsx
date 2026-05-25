import SongsCard from "../components/songcard";
import Songs from "../data/songs";
import { PrimaryBtn } from "../components/buttons";

type Props = {
  showPlaylist: boolean;
  setShowPlaylist: (show: boolean) => void;
};

function Playlist({ showPlaylist, setShowPlaylist }: Props) {
  return (
    <>
      {/* Playlist Pop-up Container */}
      <div
        className={`fixed ${showPlaylist ? "bottom-0" : "bottom-[-110%]"} bg-card-bg border-card-border z-10 flex max-h-3/4 w-full max-w-lg flex-col items-center justify-center rounded-lg border-l px-4 py-2 pb-[env(safe-area-inset-bottom)] shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300 max-lg:border lg:top-20 lg:right-0 lg:bottom-0 lg:max-h-[calc(100vh-81px)] lg:max-w-[40%] 2xl:max-w-[30%]`}
      >
        {/* Playlist Header */}
        <div className="my-2 flex h-8 w-full items-center justify-between">
          <h1 className="text-2xl font-semibold">Playlist Title</h1>
          <PrimaryBtn
            onClick={() => setShowPlaylist(!showPlaylist)}
            icon="/icons/close.svg"
            className="lg:hidden"
          />
        </div>

        {/* Playlist Body & Song List */}
        <ul className="my-3 flex min-h-0 w-full flex-1 list-none flex-col items-center justify-start gap-1.5 overflow-y-auto rounded-md px-2 pt-3 pb-[env(safe-area-inset-bottom)]">
          {Songs.map((song) => (
            <SongsCard
              key={song.name}
              songId={song.id}
              songName={song.name}
              artistName={song.artist}
              duration={song.duration}
              songImage={`/SongsBanner/${song.banner}`}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default Playlist;