"use client";
import Image from "next/image";
// import SongsCard from "../components/songcard";
import { SecondaryBtn } from "../components/Buttons";
import useMusic from "../../musicProvider";
import NavMenu from "../components/NavMenu";

function Sidebar() {
  const { showSidebar } = useMusic();

  return (
    <section
      className={`absolute ${showSidebar ? "left-0" : "left-[-110%]"} bg-card-bg border-card-border top-20 z-20 flex max-h-[calc(100vh-81px)] min-h-0 w-full max-w-lg flex-1 flex-col items-center justify-start rounded-r-xl border-r shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300 lg:max-h-[calc(100vh-81px)] 2xl:bottom-0 2xl:left-0 2xl:max-w-[30%]`}
    >
      {/* Main Navigation Menu */}
      <NavMenu
        links={[
          {
            name: "Home",
            href: "/",
            icon: "home",
          },
          {
            name: "Playlists",
            href: "/playlists",
            icon: "playlist_play",
          },
          {
            name: "Artists",
            href: "/artists",
            icon: "artist",
          },
          {
            name: "Library",
            href: "/library",
            icon: "bookmark",
          },
          {
            name: "Suggest Me",
            href: "/suggest",
            icon: "lightbulb",
          },
        ]}
      />

      {/* Favorites & Playlists Section */}
      <div className="flex min-h-0 w-full flex-1 flex-col px-3">
        {/* Favorites Header */}
        <div className="flex h-10 w-full items-center justify-between bg-(--primary-bg)">
          <h1 className="flex items-center justify-center text-2xl font-medium">
            <Image
              src={"/icons/favorite.svg"}
              alt="Play"
              width={26}
              height={26}
            />
            Favorites
          </h1>
          <SecondaryBtn>View All</SecondaryBtn>
        </div>

        {/* Favorites List */}
        <ul className="my-3 flex min-h-0 w-full flex-1 list-none flex-col items-center justify-start gap-1.5 overflow-y-auto rounded-md px-2 pt-3 pb-[env(safe-area-inset-bottom)]">
          {/* {Songs.map((song) => (
            <SongsCard
              key={song.id}
              songId={song.id}
              songName={song.name}
              artists={song.artists}
              duration={song.duration}
              songImage={`/SongsBanner/${song.banner}`}
            />
          ))} */}
        </ul>
      </div>
    </section>
  );
}

export default Sidebar;
