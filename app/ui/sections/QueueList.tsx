import SongsCard from "../components/Songcard";
import { PrimaryBtn } from "../components/Buttons";
import useMusic from "../../musicProvider";
import ErrorMsg from "../components/Error";
import Image from "next/image";
import { useState } from "react";
import { SecondaryBtn } from "../components/Buttons";

type Props = {
  showPlaylist: boolean;
  setShowPlaylist: (show: boolean) => void;
};

function QueueList({ showPlaylist, setShowPlaylist }: Props) {
  const { queue, setQueue } = useMusic();
  const [edit, setEdit] = useState(false);

  const handleRemove = (id: number) => {
    setQueue(queue.filter(q => q.id !== id));
  } 
  return (
    <>
      {/* Playlist Pop-up Container */}
      <div
        className={`fixed ${showPlaylist ? "bottom-0" : "bottom-[-110%]"} bg-card-bg border-card-border z-10 flex max-h-3/4 w-full max-w-lg flex-col items-center justify-center rounded-lg border px-4 py-2 pb-[env(safe-area-inset-bottom)] shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300 lg:bottom-0 lg:right-0 lg:top-20.25 lg:max-h-[calc(100vh-81px)] lg:max-w-[40%] 2xl:max-w-[30%]`}
      >
        {/* Playlist Header */}
        <div className="my-2 flex h-8 w-full items-center justify-between">
          <div className="flex justify-center items-center ">
          <Image src="/icons/queue_music.svg" alt="Queue list icon" width={38} height={38} />
          <h1 className="text-3xl font-semibold">Queue List</h1>
          </div>
          <PrimaryBtn
            onClick={() => setShowPlaylist(!showPlaylist)}
            icon="/icons/close.svg"
            className="lg:hidden"
          />
        </div>

        {/* Playlist Body & Song List */}
        <ul className="my-3 flex min-h-0 w-full flex-1 list-none flex-col items-center justify-start gap-1.5 overflow-y-auto rounded-md px-2 pt-3 pb-[env(safe-area-inset-bottom)]">
          {queue.length > 0 ?queue.map((song) => (
            <SongsCard
              key={song.name}
              id={song.id}
              name={song.name}
              artists={song.artists}
              duration={song.duration}
              banner={song.banner}
              url={song.url}
              onClick={edit ? handleRemove : undefined}
              onClickIcon="/icons/delete.svg"
            />
          )) : (
                  <ErrorMsg>You dont have any Songs here!</ErrorMsg>
                )}
        </ul>
        <div className="absolute bottom-1 right-1">
          <SecondaryBtn icon={!edit ? "/icons/edit.svg" : "/icons/close.svg"} onClick={() => setEdit(!edit)}>{edit ? "Exit" : "Edit"}</SecondaryBtn>
        </div>
      </div>
    </>
  );
}

export default QueueList;
