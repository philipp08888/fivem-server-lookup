/**
 * @jest-environment node
 */

import { GET } from "@/app/api/search/route";
import { NextRequest } from "next/server";
import nodeMocks from "node-mocks-http";
import { mockServers } from "@/tests/integration/frontend/__fixtures__/results.fixture";
import { prisma } from "@/src/prisma";

jest.mock("@/src/prisma", () => ({
  _esModule: true,
  prisma: {
    server: {
      findMany: jest.fn(),
    },
  },
}));

describe("/api/search Route", () => {
  it("should return 400 if query parameter is missing", async () => {
    const req = nodeMocks.createRequest<NextRequest & Request>({
      url: "http://localhost:3000/api/search",
    });

    const response = await GET(req);

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toEqual({ error: "Please provide a query parameter" });
  });

  it("should return 400 if query parameter is empty", async () => {
    const req = nodeMocks.createRequest<NextRequest & Request>({
      url: "http://localhost:3000/api/search?query=%20",
    });

    const response = await GET(req);

    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result).toEqual({ error: "Please provide a valid query parameter" });
  });

  it("should return 200 and results if query parameter is valid", async () => {
    (prisma.server.findMany as jest.Mock).mockResolvedValue(mockServers);

    const req = nodeMocks.createRequest<NextRequest & Request>({
      url: `http://localhost:3000/api/search?query=${encodeURIComponent(mockServers[0].hostname.substring(0, 11))}`,
    });

    const response = await GET(req);

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result).toEqual(mockServers);
  });
});
