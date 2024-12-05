"use client";

import { useCallback, useEffect, useState } from "react";

export type SearchRequest = {
  query: string;
  date: Date;
};

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchRequest[]>([]);

  const getLocalSearchHistory = (): SearchRequest[] => {
    if (typeof window === "undefined") return [];
    const history = localStorage.getItem("SEARCH_HISTORY");

    if (!history) {
      return [];
    }

    const parsedHistory = JSON.parse(history);

    return parsedHistory.map((request: SearchRequest) => ({
      ...request,
      date: new Date(request.date),
    }));
  };

  useEffect(() => {
    const localSearchHistory = getLocalSearchHistory();
    setSearchHistory(localSearchHistory);
  }, []);

  const addSearchRequest = useCallback((query: string) => {
    setSearchHistory((prevHistory) => {
      const updatedSearchHistory = [
        { query, date: new Date() },
        ...prevHistory.slice(0, 4),
      ];

      updatedSearchHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      localStorage.setItem(
        "SEARCH_HISTORY",
        JSON.stringify(updatedSearchHistory),
      );

      return updatedSearchHistory;
    });
  }, []);

  return { searchHistory, addSearchRequest };
};
