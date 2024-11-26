"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const ID_REGEX = /(?:cfx\.re\/(?:join\/)?)?([a-zA-Z0-9]+)/;

export const SearchBar = (): React.JSX.Element => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const startSearch = useCallback(() => {
    const match = serverUrl.trim().match(ID_REGEX);
    if (match) {
      router.push(`/lookup?query=${encodeURIComponent(match[1])}`);
    } else {
      setError("Invalid Server-Id");
    }
  }, [router, serverUrl]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      startSearch();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center max-w-[1000px] shadow-bg w-full mx-auto rounded-md bg-[#333] py-2 px-4">
        <input
          placeholder="Search"
          className="bg-[#333] appearance-none outline-none w-full"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <MagnifyingGlassIcon
          className="size-4 cursor-pointer"
          onClick={startSearch}
          tabIndex={0}
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  );
};
