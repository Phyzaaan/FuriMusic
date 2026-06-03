"use client";
import { useState } from "react";
import useMusic from "../../musicProvider";
import { PrimaryBtn } from "../components/buttons";
import Searchbar from "../components/searchbar";
import { Suspense } from "react";

function Header() {
  const [showSearchbar, setShowSearchbar] = useState(false);
  const { showSidebar, setShowSidebar } = useMusic();
  return (
    <header className="text-primary bg-card-bg border-card-border absolute inset-x-0 top-0 z-20 h-20 border-b saturate-150 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full absolute inset-x-4">
        <PrimaryBtn
          onClick={() => setShowSidebar(!showSidebar)}
          icon={`/icons/${showSidebar ? "close" : "menu"}.svg`}
          className={"2xl:pointer-events-none 2xl:opacity-0"}
        />
        <h1 className="bg-primary-gradient bg-clip-text text-4xl font-bold text-transparent">
          Furi Music
        </h1>
        <PrimaryBtn
          onClick={() => setShowSearchbar(!showSearchbar)}
          icon={`/icons/${showSearchbar ? "close" : "search"}.svg`}
          className="relative z-10"
        ></PrimaryBtn>

        <Suspense fallback={<div className={`bg-card-bg absolute ${showSearchbar ? "top-0" : "-top-full"} flex h-full w-full items-center justify-center transition-all duration-150`}>Loading...</div>}>
          <Searchbar showSearchbar={showSearchbar} />
        </Suspense>
      </div>
    </header>
  );
}

export default Header;
