"use client";

import { getServersByIds } from "@/app/lookup/actions";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Server } from "@prisma/client";
import _ from "lodash";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { containerVariants, itemVariants, Results } from "./Results";
import { NoResults } from "@/src/components/search/NoResults";
import { ServerTileSkeleton } from "@/src/components/search/ServerTile.skeleton";
import { useSearchHistory } from "@/src/hooks/useSearchHistory";

const ID_REGEX = /(?:cfx\.re\/(?:join\/)?)?([a-zA-Z0-9]+)/;

export type SearchMode = "RECENTLY_SEARCHED" | "RESULTS";

export const SearchBar = (): React.JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isMac, setMac] = useState<boolean>(false);

  const [results, setResults] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const prevResults = useRef<Server[]>([]);

  const [mode, setMode] = useState<SearchMode>("RECENTLY_SEARCHED");

  const { searchHistory, addSearchRequest } = useSearchHistory();

  const loadServers = useCallback(async () => {
    try {
      setIsLoading(true);

      const serverIds = searchHistory.map(
        (searchRequest) => searchRequest.query,
      );

      const fetchedServersData = await getServersByIds(serverIds);

      if (!fetchedServersData) {
        console.error("Error while loading server data:", serverIds);
        return;
      }

      setResults(fetchedServersData);
      prevResults.current = fetchedServersData;
    } catch (error) {
      console.error("Error while loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchHistory]);

  useEffect(() => {
    setMac(navigator.platform.indexOf("Mac") === 0);
  }, []);

  useEffect(() => {
    if (mode === "RECENTLY_SEARCHED") {
      void loadServers();
    }
  }, [loadServers, mode]);

  useEffect(() => {
    if (query.length === 0) {
      setMode("RECENTLY_SEARCHED");
    } else {
      setMode("RESULTS");
    }
  }, [query]);

  const startSearch = useCallback(
    (query: string) => {
      const match = query.trim().match(ID_REGEX);

      if (match) {
        addSearchRequest(match[1]);
        router.push(`/lookup?query=${encodeURIComponent(match[1])}`);
      }
    },
    [addSearchRequest, router],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setDialogOpen(false);
      startSearch(query);
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

  const fetchResults = useMemo(
    () =>
      _.debounce(async (searchQuery: string) => {
        if (searchQuery.trim() === "") {
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `/api/search?query=${encodeURIComponent(searchQuery)}`,
          );
          const data = await response.json();

          if (!_.isEqual(data, prevResults.current)) {
            setResults(data);
            prevResults.current = data;
          }
        } catch (error) {
          console.error("Error while fetching results:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 500),
    [results],
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
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative flex w-full max-w-xl flex-col rounded-md bg-[#333] shadow-bg"
              ref={dialogRef}
            >
              <div className="flex w-full items-center justify-between px-4 py-2">
                <div className="flex w-full flex-row items-center gap-1">
                  <MagnifyingGlassIcon
                    className="size-4 cursor-pointer"
                    onClick={() => {
                      setDialogOpen(false);
                      startSearch(query);
                    }}
                    aria-hidden
                  />
                  <input
                    placeholder="Search"
                    className="w-full appearance-none bg-[#333] outline-none"
                    value={query}
                    onChange={(e) => {
                      const value = e.target.value;

                      setQuery(value);
                      setIsLoading(true);
                      fetchResults(value);
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

              {!isLoading && results.length === 0 && mode === "RESULTS" && (
                <NoResults
                  onClick={() => {
                    setDialogOpen(false);
                    startSearch(query);
                  }}
                  query={query}
                />
              )}

              {isLoading && (
                <motion.div
                  className="flex flex-col gap-1 px-4 pt-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="h-2 w-16 animate-pulse rounded-md bg-[#444]" />
                  {Array(1)
                    .fill(0)
                    .map((_, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <ServerTileSkeleton />
                      </motion.div>
                    ))}
                </motion.div>
              )}

              {!isLoading && (
                <Results
                  results={results}
                  onClick={(id) => {
                    setDialogOpen(false);
                    startSearch(id);
                  }}
                  mode={mode}
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
