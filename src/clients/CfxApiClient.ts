import { Agent, request } from "undici";
import z from "zod";
import { Result } from "@philipp08888/utils";
import { defaultClientHeaders } from "@/src/constants/defaultClientHeaders";
import {
  parseAndValidateResponse,
  ParsingError,
  ValidationError,
} from "@/src/functions/parseAndValidateResponse";

const CfxApiSchema = z.object({
  EndPoint: z.string(),
  Data: z.object({
    clients: z.number().nonnegative(),
    svMaxclients: z.number().nonnegative(),
    hostname: z.string(),
    resources: z.array(z.string()),
    vars: z.record(z.string(), z.string()),
    players: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        ping: z.number(),
        identifiers: z.array(z.string()),
      }),
    ),
    upvotePower: z.number(),
    burstPower: z.number(),
    iconVersion: z.number(),
    server: z.string().optional(),
    connectEndPoints: z.array(z.string()),
    ownerName: z.string(),
    ownerID: z.number(),
    ownerAvatar: z.url().optional(),
  }),
});

export type CfxApi = z.infer<typeof CfxApiSchema>;
export type CfxApiPlayer = CfxApi["Data"]["players"][number];
export type CfxApiResource = CfxApi["Data"]["resources"][number];

export type CfxApiViolation = {
  path: string;
  message: string;
};

export class CfxApiClient {
  private readonly agent: Agent;
  private readonly baseURL = "https://servers-frontend.fivem.net/api/";

  public constructor() {
    this.agent = new Agent({
      allowH2: true,
      keepAliveTimeout: 60_000,
      keepAliveMaxTimeout: 60_000,
      maxCachedSessions: 100,
      connect: {
        timeout: 15_000,
        rejectUnauthorized: true,
      },
    });
  }

  public async getServerInformation(
    serverId: string,
  ): Promise<Result<ValidationError | ParsingError | Error, CfxApi>> {
    try {
      const response = await request(this.makeRequestUrl(serverId), {
        method: "GET",
        headers: {
          ...defaultClientHeaders,
          origin: "https://servers.fivem.net",
          referer: "https://servers.fivem.net/",
        },
        dispatcher: this.agent,
        bodyTimeout: 15_000,
        headersTimeout: 10_000,
      });

      const parseResult = await parseAndValidateResponse(
        response,
        CfxApiSchema,
        {
          parsingErrorMessage: "Failed to parse JSON response from CFX API",
          validationErrorMessage:
            "CFX API response does not match expected server data format",
        },
      );

      if (parseResult.isFailure()) {
        return Result.failure(parseResult.error);
      }

      return Result.success(parseResult.value);
    } catch (error) {
      return Result.failure(
        new Error(
          `HTTP/2 request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        ),
      );
    }
  }

  public async close() {
    await this.agent.close();
  }

  private makeRequestUrl(serverId: string): string {
    return `${this.baseURL}servers/single/${serverId}`;
  }
}
