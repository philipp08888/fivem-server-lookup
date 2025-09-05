import z from "zod";
import axios, { AxiosInstance } from "axios";
import { Result } from "@philipp08888/utils";
import { $ZodIssue } from "zod/v4/core";

export const CfxApiSchema = z.object({
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
        // Identifiers aren't exposed anymore?
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

export class CfxApiValidationError extends Error {
  public readonly violations: Array<$ZodIssue>;

  public constructor(message: string, violations: Array<$ZodIssue> = []) {
    super(message);
    this.name = "CfxApiValidationError";
    this.violations = violations;

    Object.setPrototypeOf(this, CfxApiValidationError.prototype);
  }
}

export class CfxApiClient {
  private client: AxiosInstance;

  public constructor() {
    this.client = axios.create({
      baseURL: "https://servers-frontend.fivem.net/api/",
      timeout: 1000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0",
      },
    });
  }

  public async getServerInformation(
    serverId: string,
  ): Promise<Result<CfxApiValidationError, CfxApi>> {
    const response = await this.client.get(`servers/single/${serverId}`);
    const validatedResponse = CfxApiSchema.safeParse(response.data);

    if (validatedResponse.error) {
      return Result.failure(
        new CfxApiValidationError(
          "Error while validating server data against schema",
          validatedResponse.error.issues,
        ),
      );
    }

    return Result.success(validatedResponse.data);
  }
}
