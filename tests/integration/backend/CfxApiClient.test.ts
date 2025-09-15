/**
 * @jest-environment node
 */

import { CfxApiClient } from "@/src/clients/CfxApiClient";
import { ValidationError } from "@/src/functions/parseAndValidateResponse";
import { Result } from "@philipp08888/utils";
import { request } from "undici";

jest.mock("undici", () => ({
  Agent: jest.fn().mockImplementation(() => ({
    close: jest.fn(),
  })),
  request: jest.fn(),
}));

describe("CfxApiClient", () => {
  let client: CfxApiClient;

  beforeEach(() => {
    client = new CfxApiClient();
    jest.clearAllMocks();
  });

  it("returns Success for a valid API response", async () => {
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

    (request as jest.Mock).mockResolvedValue({
      body: {
        json: async () => validData,
      },
    });

    const result = await client.getServerInformation("abc123");
    expect(Result.isSuccess(result)).toBe(true);
    if (Result.isSuccess(result)) {
      expect(result.value.EndPoint).toBe("test");
    }
  });

  it("returns Failure for an invalid API response", async () => {
    const invalidData = { foo: "bar" };
    (request as jest.Mock).mockResolvedValue({
      body: {
        json: async () => invalidData,
      },
    });

    const result = await client.getServerInformation("abc123");
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error).toBeInstanceOf(ValidationError);

      if (result.error instanceof ValidationError) {
        expect(result.error.violations.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns Failure on network error", async () => {
    (request as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await client.getServerInformation("abc123");
    expect(Result.isFailure(result)).toBe(true);
    if (Result.isFailure(result)) {
      expect(result.error.message).toContain("Network error");
    }
  });

  it("closes the agent correctly", async () => {
    const closeMock = (client as unknown as { agent: { close: jest.Mock } })
      .agent.close;
    await client.close();
    expect(closeMock).toHaveBeenCalled();
  });
});
