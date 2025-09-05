import { Agent, request } from "undici";
import z from "zod";
import { Result } from "@philipp08888/utils";
import { $ZodIssue } from "zod/v4/core";
import { defaultClientHeaders } from "@/src/constants/defaultClientHeaders";

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

export type CfxApiViolation = {
  path: string;
  message: string;
};

export class CfxApiValidationError extends Error {
  public readonly violations: Array<CfxApiViolation>;

  public constructor(message: string, violations: Array<$ZodIssue> = []) {
    super(message);
    this.name = "CfxApiValidationError";
    this.violations = this.makeViolations(violations);

    Object.setPrototypeOf(this, CfxApiValidationError.prototype);
  }

  private makeViolations(input: Array<$ZodIssue>): Array<CfxApiViolation> {
    return input.map((issue) => ({
      message: issue.message,
      path: issue.path.join("."),
    }));
  }
}

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
  ): Promise<Result<CfxApiValidationError | Error, CfxApi>> {
    try {
      const { body } = await request(this.makeRequestUrl(serverId), {
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

      const bodyJson = await body.json();
      const validatedResponse = CfxApiSchema.safeParse(bodyJson);

      if (validatedResponse.error) {
        return Result.failure(
          new CfxApiValidationError(
            "Error while validating server data against schema",
            validatedResponse.error.issues,
          ),
        );
      }

      return Result.success(validatedResponse.data);
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
