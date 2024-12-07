/**
 * @jest-environment node
 */

import upsertServer from "@/src/functions/upsertServer";
import { mockServers } from "@/tests/integration/frontend/__fixtures__/results.fixture";
import xss from "xss";
import { prisma } from "@/src/prisma";

jest.mock("xss", () => jest.fn((input) => `sanitized_${input}`));

jest.mock("@/src/prisma", () => ({
  _esModule: true,
  prisma: {
    server: {
      upsert: jest.fn(),
    },
  },
}));

describe("upsertServer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if id is missing", async () => {
    await expect(upsertServer("", "hostname", "image")).rejects.toThrow(
      "id, hostname, and image are required and cannot be null or empty.",
    );
  });

  it("should throw an error if hostname is missing", async () => {
    await expect(upsertServer("id", "", "image")).rejects.toThrow(
      "id, hostname, and image are required and cannot be null or empty.",
    );
  });

  it("should throw an error if image is missing", async () => {
    await expect(upsertServer("id", "hostname", "")).rejects.toThrow(
      "id, hostname, and image are required and cannot be null or empty.",
    );
  });

  it("should sanitize hostname and upsert server", async () => {
    const mockServer = mockServers[0];
    const sanitizedHostName = `sanitized_${mockServer.hostname}`;

    await upsertServer(mockServer.id, mockServer.hostname, mockServer.image);

    expect(xss).toHaveBeenCalledWith(mockServer.hostname);
    expect(prisma.server.upsert).toHaveBeenCalledWith({
      where: { id: mockServer.id },
      update: { hostname: sanitizedHostName, image: mockServer.image },
      create: {
        id: mockServer.id,
        hostname: sanitizedHostName,
        image: mockServer.image,
      },
    });
  });

  it("should throw an error if upsert into db fails", async () => {
    const error = new Error("Unexpected database error");
    (prisma.server.upsert as jest.Mock).mockRejectedValueOnce(error);

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const mockServer = mockServers[0];

    await expect(
      upsertServer(mockServer.id, mockServer.hostname, mockServer.image),
    ).rejects.toThrow(error);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "Error while saving server:",
      error,
    );
    consoleErrorMock.mockRestore();
  });
});
