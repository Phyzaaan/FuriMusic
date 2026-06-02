'use client';
import { PrimaryBtn } from "./buttons";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type props = {
  showSearchbar: boolean,
}

function Searchbar({ showSearchbar }: props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <div
      className={`bg-card-bg absolute ${showSearchbar ? "top-0" : "-top-full"} flex h-full w-full items-center justify-center transition-all duration-150`}
    >
      <div className="bg-dark-bg border-card-border flex w-3/4 items-center justify-between rounded-md border">
        <input
          type="text"
          placeholder="Search song, artist, playlist..."
          className="w-full px-2 py-1 text-lg outline-none"
          onChange={(e) =>
            handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
        <PrimaryBtn
          icon={`/icons/search.svg`}
          width={24}
          height={24}
          className="pr-2"
        />
      </div>
    </div>
  )
}

export default Searchbar;