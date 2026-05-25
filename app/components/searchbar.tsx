import { PrimaryBtn } from "./buttons";

type props = {
    showSearchbar: boolean,
}

function Searchbar({ showSearchbar }: props) {
    return (
    <div
        className={`bg-card-bg absolute ${showSearchbar ? "top-0" : "-top-full"} flex h-full w-full items-center justify-center transition-all duration-150`}
      >
        <div className="bg-dark-bg border-card-border flex w-3/4 items-center justify-between rounded-md border">
          <input
            type="text"
            placeholder="Search song, artist, playlist..."
            className="w-full px-2 py-1 text-lg outline-none"
          />
          <PrimaryBtn
            icon={`/icons/search.svg`}
            width={24}
            height={24}
            className="pr-2"
          ></PrimaryBtn>
        </div>
      </div>
    )
}

export default Searchbar;