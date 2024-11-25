"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const ID_REGEX = /(?:cfx\.re\/(?:join\/)?)?([a-zA-Z0-9]+)/;

export const SearchBar = (): React.JSX.Element => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const router = useRouter();

  const startSearch = useCallback(() => {
    const match = serverUrl.trim().match(ID_REGEX);
    if (match) {
      router.push(`/lookup?query=${encodeURIComponent(match[1])}`);
    }
  }, [router, serverUrl]);

  return (
    <>
      <div className="flex justify-center items-center gap-4">
        <div className="flex flex-col gap-1 bg-[#333] px-4 py-2 rounded-md">
          <label htmlFor="search" className="text-sm text-[#aaa]">
            Cfx Url
          </label>
          <input
            id="search"
            className="bg-[#333] text-[#aaa] outline-none"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="Enter ID"
          />
        </div>
        <button
          className="bg-[#2D73DD] px-4 py-2 rounded-md"
          onClick={startSearch}
        >
          Start Lookup
        </button>
      </div>
    </>
  );
};
