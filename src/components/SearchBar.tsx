"use client";

import { getServersByIds } from "@/app/lookup/actions";
import {
  ArrowUpRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Server } from "@prisma/client";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatToHTMLColor } from "../functions/formatToHTMLColor";
import { Tag } from "./Tag";

const ID_REGEX = /(?:cfx\.re\/(?:join\/)?)?([a-zA-Z0-9]+)/;

type SearchRequest = {
  query: string;
  date: Date;
};

export const SearchBar = (): React.JSX.Element => {
  const [serverUrl, setServerUrl] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<SearchRequest[]>([]);
  const router = useRouter();

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [isMac, setMac] = useState<boolean>(false);
  const [serversData, setServersData] = useState<Server[]>([]);

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
        (searchRequest) => searchRequest.query
      );

      const fetchedServersData = await getServersByIds(serverIds);

      if (!fetchedServersData) {
        console.error("Error while loading server data:", serverIds);
        return;
      }

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
    loadServers();
  }, [searchHistory, loadServers]);

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
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          localStorage.setItem(
            "SEARCH_HISTORY",
            JSON.stringify(updatedSearchHistory)
          );

          return updatedSearchHistory;
        });

        router.push(`/lookup?query=${encodeURIComponent(match[1])}`);
      }
    },
    [router]
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

  return (
    <>
      <div className="w-full flex max-w-[1000px] mx-auto justify-end">
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
            className="fixed inset-0 bg-opacity-80 bg-black flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-md w-full max-w-xl relative shadow-bg bg-[#333] flex flex-col"
              ref={dialogRef}
            >
              <div className="flex justify-between w-full items-center px-4 py-2">
                <div className="flex flex-row gap-1 items-center w-full">
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
                    className="bg-[#333] appearance-none outline-none w-full"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                </div>
                <div className="bg-[#555] p-1 rounded-sm text-xs text-[#ccc] select-none whitespace-nowrap">
                  {isMac ? "⌘ + K" : "Ctrl + K"}
                </div>
              </div>
              {serversData.length > 0 && (
                <div className="flex flex-col gap-2 border-t-2 border-[#444] px-4 pb-4 pt-2">
                  <Tag>Recently searched servers</Tag>
                  <ul className="flex flex-col gap-1">
                    {serversData.map((server, index) => (
                      <li
                        key={server.id + index}
                        className="flex w-full gap-4 flex-row cursor-pointer hover:bg-[#444] p-2 rounded-md"
                        onClick={() => {
                          setDialogOpen(false);
                          startSearch(server.id);
                        }}
                      >
                        <div className="flex flex-row gap-2">
                          <img
                            src="https://cdn.discordapp.com/icons/630183489915977756/a_25217891e2fcbcddf64a0180814d02d8.gif"
                            width={64}
                            height={64}
                            alt="Icon"
                            className="rounded-md w-12 h-12"
                          />
                          <div className="line-clamp-2 overflow-hidden text-ellipsis">
                            {formatToHTMLColor(server.hostname)}
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <ArrowUpRightIcon className="size-4" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-row justify-end gap-2 bg-[#333] rounded-b-md p-2 border-t-2 border-[#555]">
                <div className="flex flex-row gap-1 items-center">
                  <span className="rounded-md text-[#ccc] bg-[#444] shadow-md p-0.5 select-none">
                    esc
                  </span>
                  Close
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <span className="rounded-md text-[#ccc] bg-[#444] shadow-md p-0.5 select-none">
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
