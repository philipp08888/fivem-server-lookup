/**
 * @jest-environment node
 */

import { ServerApiClient } from "@/src/clients/ServerApiClient";
import { ValidationError } from "@/src/functions/parseAndValidateResponse";
import { safeRequest } from "@philipp08888/utils";

jest.mock("@philipp08888/utils", () => ({
  Result: {
    success: jest.fn((data) => ({
      isFailure: () => false,
      isSuccess: () => true,
      value: data,
    })),
    failure: jest.fn((error) => ({
      isFailure: () => true,
      isSuccess: () => false,
      error,
    })),
  },
  safeRequest: jest.fn(),
}));

const mockSafeRequest = jest.mocked(safeRequest);

describe("ServerApiClient", () => {
  let client: ServerApiClient;

  beforeEach(() => {
    client = new ServerApiClient();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await client.close();
  });

  describe("getPlayers", () => {
    it("should return success with valid players data", async () => {
      const mockPlayersData = [
        {
          id: 1,
          name: "TestPlayer",
          ping: 50,
          identifiers: ["steam:123456"],
        },
      ];

      const mockResponse = {
        isFailure: jest.fn(() => false),
        isSuccess: jest.fn(() => true),
        value: {
          statusCode: 200,
          headers: {},
          body: { json: jest.fn().mockResolvedValue(mockPlayersData) },
          trailers: {},
          opaque: null,
          context: {},
        },
      };

      mockSafeRequest.mockResolvedValue(mockResponse as never);

      const result = await client.getPlayers("127.0.0.1:30120");

      expect(mockSafeRequest).toHaveBeenCalledWith(
        "http://127.0.0.1:30120/players.json",
        {
          dispatcher: expect.any(Object),
          method: "GET",
          headersTimeout: 15_000,
        },
      );
      expect(result.isFailure()).toBe(false);

      if (!result.isFailure()) {
        expect(result.value).toEqual(mockPlayersData);
      }
    });

    it("should return failure when safeRequest fails", async () => {
      const mockError = new Error("Network error");
      const mockResponse = {
        isFailure: jest.fn(() => true),
        isSuccess: jest.fn(() => false),
        error: mockError,
      };

      mockSafeRequest.mockResolvedValue(mockResponse as never);
      const result = await client.getPlayers("127.0.0.1:30120");

      expect(result.isFailure()).toBe(true);

      if (result.isFailure()) {
        expect(result.error).toBe(mockError);
      }
    });

    it("should return validation error for invalid response data", async () => {
      const invalidData = [
        {
          id: "invalid", // should be number
          name: "TestPlayer",
          ping: 50,
          identifiers: ["steam:123456"],
        },
      ];

      const mockResponse = {
        isFailure: jest.fn(() => false),
        isSuccess: jest.fn(() => true),
        value: {
          statusCode: 200,
          headers: {},
          body: { json: jest.fn().mockResolvedValue(invalidData) },
          trailers: {},
          opaque: null,
          context: {},
        },
      };

      mockSafeRequest.mockResolvedValue(mockResponse as never);

      const result = await client.getPlayers("127.0.0.1:30120");

      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.message).toBe(
          "Server response does not match expected player data format",
        );
      }
    });

    it("should handle empty players array", async () => {
      const mockResponse = {
        isFailure: jest.fn(() => false),
        isSuccess: jest.fn(() => true),
        value: {
          statusCode: 200,
          headers: {},
          body: { json: jest.fn().mockResolvedValue([]) },
          trailers: {},
          opaque: null,
          context: {},
        },
      };

      mockSafeRequest.mockResolvedValue(mockResponse as never);

      const result = await client.getPlayers("127.0.0.1:30120");

      expect(result.isFailure()).toBe(false);
      if (!result.isFailure()) {
        expect(result.value).toEqual([]);
      }
    });

    it("should return validation error for missing required fields", async () => {
      const invalidData = [
        {
          id: 1,
          name: "TestPlayer",
          // missing ping and identifiers
        },
      ];

      const mockResponse = {
        isFailure: jest.fn(() => false),
        isSuccess: jest.fn(() => true),
        value: {
          statusCode: 200,
          headers: {},
          body: { json: jest.fn().mockResolvedValue(invalidData) },
          trailers: {},
          opaque: null,
          context: {},
        },
      };

      mockSafeRequest.mockResolvedValue(mockResponse as never);

      const result = await client.getPlayers("127.0.0.1:30120");

      expect(result.isFailure()).toBe(true);
      if (result.isFailure()) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });
  });

  describe("makeRequestUrl", () => {
    beforeEach(() => {
      const mockResponse = {
        isFailure: jest.fn(() => false),
        isSuccess: jest.fn(() => true),
        value: {
          statusCode: 200,
          headers: {},
          body: { json: jest.fn().mockResolvedValue([]) },
          trailers: {},
          opaque: null,
          context: {},
        },
      };
      mockSafeRequest.mockResolvedValue(mockResponse as never);
    });

    it("should construct correct URL for players endpoint", async () => {
      const serverUrl = "127.0.0.1:30120";

      await client.getPlayers(serverUrl);

      expect(mockSafeRequest).toHaveBeenCalledWith(
        "http://127.0.0.1:30120/players.json",
        expect.any(Object),
      );
    });

    it("should construct correct URL for different server formats", async () => {
      const serverUrl = "mycoolserver.com:30120";

      await client.getPlayers(serverUrl);

      expect(mockSafeRequest).toHaveBeenCalledWith(
        "http://mycoolserver.com:30120/players.json",
        expect.any(Object),
      );
    });
  });

  describe("close", () => {
    it("should close the agent without errors", async () => {
      const newClient = new ServerApiClient();
      await expect(newClient.close()).resolves.not.toThrow();
    });
  });
});
