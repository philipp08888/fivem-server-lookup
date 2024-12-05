import { SearchRequest, useSearchHistory } from "@/src/hooks/useSearchHistory";
import { act, renderHook } from "@testing-library/react";

describe("useSearchHistory", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty history", () => {
    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.searchHistory).toEqual([]);
  });

  it("should load history from localStorage", () => {
    const mockHistory: SearchRequest[] = [
      { query: "SERVER_ID_123", date: new Date() },
    ];

    localStorage.setItem("SEARCH_HISTORY", JSON.stringify(mockHistory));

    const { result } = renderHook(() => useSearchHistory());
    expect(result.current.searchHistory).toEqual(mockHistory);
  });

  it("should add a new search request to history", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addSearchRequest("SERVER_ID_ABC");
    });

    expect(result.current.searchHistory).toHaveLength(1);
    expect(result.current.searchHistory[0].query).toBe("SERVER_ID_ABC");

    const storedHistory = JSON.parse(localStorage.getItem("SEARCH_HISTORY")!);
    expect(storedHistory).toHaveLength(1);
  });
});
