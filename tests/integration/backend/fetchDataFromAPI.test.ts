/**
 * @jest-environment node
 */

import fetchDataFromAPI from "@/src/functions/fetchDataFromAPI";

global.fetch = jest.fn();

describe("fetchDataFromAPI", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return data when API call is successful", async () => {
    const mockResponseData = {
      Data: { id: "server-123", name: "Test Server" },
    };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData),
    });

    const query = "test-query";
    const result = await fetchDataFromAPI(query);

    expect(fetch).toHaveBeenCalledWith(
      `https://servers-frontend.fivem.net/api/servers/single/${query}`,
    );
    expect(result).toEqual(mockResponseData.Data);
  });

  it("should return null and log an error if the API response is not OK", async () => {
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    const query = "invalid-query";
    const result = await fetchDataFromAPI(query);

    expect(fetch).toHaveBeenCalledWith(
      `https://servers-frontend.fivem.net/api/servers/single/${query}`,
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Failed to fetch data: Not Found",
    );
    expect(result).toBeNull();

    consoleErrorMock.mockRestore();
  });

  it("should return null if fetch throws an error", async () => {
    const fetchError = new Error("Network error");

    (fetch as jest.Mock).mockRejectedValueOnce(fetchError);

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const query = "query-causing-error";
    const result = await fetchDataFromAPI(query);

    expect(fetch).toHaveBeenCalledWith(
      `https://servers-frontend.fivem.net/api/servers/single/${query}`,
    );

    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Failed to fetch data:",
      fetchError.message,
    );

    expect(result).toBeNull();

    consoleErrorMock.mockRestore();
  });
});
