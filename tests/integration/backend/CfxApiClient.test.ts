import axios from "axios";
import {
  CfxApiClient,
  CfxApiValidationError,
} from "@/src/clients/CfxApiClient";
import { Result } from "@philipp08888/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CfxApiClient", () => {
  let client: CfxApiClient;
  let getMock: jest.Mock;

  beforeEach(() => {
    getMock = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue({ get: getMock });
    client = new CfxApiClient();
    jest.clearAllMocks();
  });

  it("should return success for valid API response", async () => {
    const validData = {
      EndPoint: "test",
      Data: {
        clients: 1,
        svMaxclients: 32,
        hostname: "Test Server",
        resources: ["resource1"],
        vars: { foo: "bar" },
        players: [{ id: 1, name: "Player1", ping: 50, identifiers: ["id1"] }],
        upvotePower: 1,
        burstPower: 1,
        iconVersion: 1,
        connectEndPoints: ["endpoint1"],
        ownerName: "Owner",
        ownerID: 123,
      },
    };

    getMock.mockResolvedValue({ data: validData });

    const result = await client.getServerInformation("abc123");
    expect(Result.isSuccess(result)).toBe(true);
    if (Result.isSuccess(result)) {
      expect(result.value.EndPoint).toBe("test");
    }
  });

  it("should return failure for invalid API response", async () => {
    const invalidData = { foo: "bar" };
    getMock.mockResolvedValue({ data: invalidData });

    const result = await client.getServerInformation("abc123");
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error).toBeInstanceOf(CfxApiValidationError);
      expect(result.error.violations.length).toBeGreaterThan(0);
    }
  });

  it("should throw if axios throws", async () => {
    getMock.mockRejectedValue(new Error("Network error"));

    await expect(client.getServerInformation("abc123")).rejects.toThrow(
      "Network error",
    );
  });
});
