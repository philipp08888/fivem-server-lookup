"use client";

import { getServersByIds } from "@/app/lookup/actions";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Server } from "@prisma/client";
import _ from "lodash";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Results } from "./Results";

const ID_REGEX = /(?:cfx\.re\/(?:join\/)?)?([a-zA-Z0-9]+)/;

type SearchRequest = {
  query: string;
  date: Date;
};

export const SearchBar = (): React.JSX.Element => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const router = useRouter();

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isMac, setMac] = useState<boolean>(false);
  const [serversData, setServersData] = useState<Server[]>([]);

  const [results, setResults] = useState<Server[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchHistory, setSearchHistory] = useState<SearchRequest[]>([]);

  const getRecentSearchRequests: SearchRequest[] = useMemo(() => {
    if (typeof window !== "undefined") {
      const localSearchHistory = localStorage.getItem("SEARCH_HISTORY");

      if (!localSearchHistory) {
        localStorage.setItem("SEARCH_HISTORY", JSON.stringify([]));
      }

      return localSearchHistory ? JSON.parse(localSearchHistory) : [];
    }
    return [];
  }, []);

  const loadServers = useCallback(async () => {
    try {
      const searchRequests = getRecentSearchRequests;

      const serverIds = searchRequests.map(
        (searchRequest) => searchRequest.query,
      );

      const fetchedServersData = await getServersByIds(serverIds);

      if (!fetchedServersData) {
        console.error("Error while loading server data:", serverIds);
        return;
      }

      console.log(_.isEqual(fetchedServersData, serversData));
      setServersData(fetchedServersData);
    } catch {
      console.error("Error while loading data");
    }
  }, [getRecentSearchRequests]);

  useEffect(() => {
    setMac(navigator.platform.indexOf("Mac") === 0);

    if (typeof window !== "undefined") {
      const localSearchHistory = localStorage.getItem("SEARCH_HISTORY");
      const parsedSearchHistory = JSON.parse(localSearchHistory ?? "");

      if (parsedSearchHistory) {
        setSearchHistory(parsedSearchHistory);
      }
    }
  }, []);

  useEffect(() => {
    void loadServers();
    console.log("LOADING NEW SERVEr");
  }, [searchHistory]);

  const startSearch = useCallback(
    (query: string) => {
      const match = query.trim().match(ID_REGEX);

      if (match) {
        setSearchHistory((prevHistory) => {
          const updatedSearchHistory = [
            ...prevHistory.slice(0, 4),
            { query: query, date: new Date() },
          ];

          updatedSearchHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

          localStorage.setItem(
            "SEARCH_HISTORY",
            JSON.stringify(updatedSearchHistory),
          );

          console.log("UPDATED  TO", updatedSearchHistory);

          return updatedSearchHistory;
        });

        router.push(`/lookup?query=${encodeURIComponent(match[1])}`);
      }
    },
    [router],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setDialogOpen(false);
      startSearch(serverUrl);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      setDialogOpen((prevState) => !prevState);
    }

    if (event.key === "Escape") {
      setDialogOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        setDialogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (searchTerm: string) => {
        setLoading(true);

        if (searchTerm) {
          const response = await fetch(
            `/api/search?query=${encodeURIComponent(searchTerm)}`,
          );
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }

        setLoading(false);
      }, 500),
    [],
  );

  useEffect(() => {
    if (inputRef.current && isDialogOpen) {
      inputRef.current.focus();
    }
  }, [isDialogOpen]);

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1000px] justify-end">
        <MagnifyingGlassIcon
          onClick={() => setDialogOpen(true)}
          className="size-4 cursor-pointer"
        />
      </div>
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative flex w-full max-w-xl flex-col rounded-md bg-[#333] shadow-bg"
              ref={dialogRef}
            >
              <div className="flex w-full items-center justify-between px-4 py-2">
                <div className="flex w-full flex-row items-center gap-1">
                  <MagnifyingGlassIcon
                    className="size-4 cursor-pointer"
                    onClick={() => {
                      setDialogOpen(false);
                      startSearch(serverUrl);
                    }}
                    aria-hidden
                  />
                  <input
                    placeholder="Search"
                    className="w-full appearance-none bg-[#333] outline-none"
                    value={serverUrl}
                    onChange={(e) => {
                      setServerUrl(e.target.value);
                      debouncedSearch(e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                    ref={inputRef}
                    type="text"
                  />
                </div>
                <div className="select-none whitespace-nowrap rounded-sm bg-[#555] p-1 text-xs text-[#ccc]">
                  {isMac ? "⌘ + K" : "Ctrl + K"}
                </div>
              </div>
              {serverUrl.length > 0 ? (
                <Results
                  results={results}
                  onClick={(id) => {
                    setDialogOpen(false);
                    startSearch(id);
                  }}
                  tag="SEARCH_RESULTS"
                  loading={loading}
                  query={serverUrl}
                />
              ) : (
                <Results
                  results={serversData}
                  onClick={(id) => {
                    setDialogOpen(false);
                    startSearch(id);
                  }}
                  tag="RECENTLY_SEARCHED"
                  loading={loading}
                />
              )}

              <div className="flex flex-row justify-end gap-2 rounded-b-md border-t-2 border-[#555] bg-[#333] p-2">
                <div className="flex flex-row items-center gap-1">
                  <span className="select-none rounded-md bg-[#444] p-0.5 text-[#ccc] shadow-md">
                    esc
                  </span>
                  Close
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span className="select-none rounded-md bg-[#444] p-0.5 text-[#ccc] shadow-md">
                    ↵
                  </span>
                  Return
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
