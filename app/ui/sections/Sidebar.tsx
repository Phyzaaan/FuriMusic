"use client";
import Image from "next/image";
import SongsCard from "../components/Songcard";
import { SecondaryBtn } from "../components/Buttons";
import useMusic from "../../musicProvider";
import { loadSong } from "@/app/utils/libs/playSong";
import NavMenu from "../components/NavMenu";
import ErrorMsg from "../components/Error";
import { useState } from "react";

function Sidebar() {
  const { showSidebar, fav, setFav, setQueue, setCurrTrack, isAdmin } = useMusic();
  const [edit, setEdit] = useState(false);

  const handlePlayAll = () => {
    if (!fav?.length) return;
    setQueue(fav);
    const first = fav[0];
    setCurrTrack(first);
    loadSong(first, true);
  };

  const handleRemove = (id: number) => {
    setFav(fav.filter(f => f.id !== id));
  } 

  const Links = [
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
      name: "Songs",
      href: "/songs",
      icon: "music_note",
    },
    {
      name: "Suggest Me",
      href: "/suggest",
      icon: "lightbulb"
    },
    {
      name: "About",
      href: "/about",
      icon: "info",
    },
  ]
  const sidebarLinks = isAdmin 
  ? [...Links, { name: "Dashboard", href: "/Dashboard", icon: "admin" }] 
  : Links;

  return (
    <section
      className={`absolute ${showSidebar ? "left-0" : "left-[-110%]"} bg-card-bg border-card-border top-20.25 z-20 flex max-h-[calc(100vh-81px)] h-full w-full max-w-lg flex-1 flex-col items-center justify-start rounded-r-xl border shadow-lg saturate-150 backdrop-blur-xl transition-all duration-300 2xl:bottom-0 2xl:left-0 2xl:max-w-[30%]`}
    >
      {/* Main Navigation Menu */}
      <NavMenu
        links={sidebarLinks}
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
          <SecondaryBtn
            onClick={handlePlayAll}
          >Play All</SecondaryBtn>
        </div>

        {/* Favorites List */}
        <ul className="relative my-3 flex min-h-0 w-full flex-1 list-none flex-col items-center justify-start gap-1.5 overflow-y-auto rounded-md px-2 pt-3 pb-[env(safe-area-inset-bottom)]">
          {fav.length > 0 ? fav.map((song) => (
            <SongsCard
              key={song.id}
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
            <ErrorMsg>You dont have an Favorites!</ErrorMsg>
          )}
        </ul>
        <div className="absolute bottom-1 right-1">
          <SecondaryBtn icon={!edit ? "/icons/edit.svg" : "/icons/close.svg"} onClick={() => setEdit(!edit)}>{edit ? "Exit" : "Edit"}</SecondaryBtn>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
