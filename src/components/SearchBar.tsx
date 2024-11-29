"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Tag } from "./Tag";

const ID_REGEX = /(?:cfx\.re\/(?:join\/)?)?([a-zA-Z0-9]+)/;

type SearchRequest = {
  query: string;
  date: Date;
};

export const SearchBar = (): React.JSX.Element => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setFocused] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<SearchRequest[]>([]);
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const searchHistoryStorage = localStorage.getItem("SEARCH_HISTORY");

    if (searchHistoryStorage) {
      console.log("Loading from localStorage ");
      console.log({ searchHistoryStorage });
      const loadedHistory: SearchRequest[] = JSON.parse(searchHistoryStorage);

      console.log("loaded history: " + loadedHistory.length);

      setSearchHistory(loadedHistory);

      console.log("updated search history from storage");
      console.log({ searchHistory });
      console.log("done");
    }
  }, []);

  const startSearch = useCallback(
    (query: string) => {
      const match = query.trim().match(ID_REGEX);

      console.log({ query });
      console.log("search request started");

      if (match) {
        setSearchHistory((prevHistory) => {
          const updatedSearchHistory = [
            ...prevHistory.slice(0, 4),
            { query: query, date: new Date() },
          ];

          updatedSearchHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          localStorage.setItem(
            "SEARCH_HISTORY",
            JSON.stringify(updatedSearchHistory)
          );

          return updatedSearchHistory;
        });

        router.push(`/lookup?query=${encodeURIComponent(match[1])}`);
      } else {
        setError("Invalid Server-Id");
      }
    },
    [router]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      startSearch(serverUrl);
    }
  };

  return (
    <div className="flex relative flex-col items-center max-w-[1000px] shadow-bg w-full mx-auto rounded-md bg-[#333]">
      <div className="flex justify-between w-full items-center px-4 py-2">
        <input
          placeholder="Search"
          className="bg-[#333] appearance-none outline-none w-full"
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          ref={inputRef}
        />
        <MagnifyingGlassIcon
          className="size-4 cursor-pointer"
          onClick={() => startSearch(serverUrl)}
          tabIndex={0}
          aria-hidden
        />
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {isFocused && searchHistory.length > 0 && (
        <motion.div
          className="absolute top-full border-t z-10 border-[#ccc] w-full py-2 px-4  bg-[#333] shadow-bg rounded-b-md"
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Tag>Search Requests - Lookup</Tag>
          <ul>
            <AnimatePresence>
              {searchHistory.map((historyItem, index) => (
                <motion.li
                  key={historyItem.query + index}
                  onClick={() => {
                    console.log({ historyItem });
                    startSearch(historyItem.query);
                    setFocused(false);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full hover:bg-[#444] cursor-pointer rounded-md px-0.5"
                >
                  {historyItem.query} -{" "}
                  {new Date(historyItem.date).toUTCString()}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>
      )}
    </div>
  );
};
