import z from "zod";
import { Agent, interceptors } from "undici";
import { Result, safeRequest } from "@philipp08888/utils";
import Errors from "undici-types/errors";
import RetryHandler from "undici/types/retry-handler";
import { parseAndValidateResponse, ValidationError, ParsingError } from "@/src/functions/parseAndValidateResponse";
import UndiciError = Errors.UndiciError;

const RETRY_CONFIG: RetryHandler.RetryOptions = {
  maxRetries: 3,
  minTimeout: 1000,
  maxTimeout: 10000,
  timeoutFactor: 2,
  retryAfter: true,
  statusCodes: [429, 500, 502, 503, 504],
  errorCodes: ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND"],
} as const;

const GetPlayersSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    ping: z.number(),
    identifiers: z.array(z.string()),
  }),
);

export type ServerPlayers = z.infer<typeof GetPlayersSchema>;
export type ServerPlayer = ServerPlayers[number];

/**
 * The `ServerApiClient` provides the same data as the `CfxApiClient`,
 * but communicates directly with game servers, without CFX's proxy mechanism.
 *
 * Benefits of direct server communication:
 * - No rate limiting observed when making direct requests to servers
 * - Better distribution of request load across multiple server endpoints
 *
 * Note: If rate limiting were implemented, we would have more buckets because
 * each server would have its own bucket rather than all requests sharing
 * CFX's single bucket.
 */
export class ServerApiClient {
  private readonly agent;

  public constructor() {
    this.agent = new Agent({
      allowH2: true,
    }).compose(interceptors.retry(RETRY_CONFIG));
  }

  public async getPlayers(
    serverUrl: string,
  ): Promise<
    Result<ValidationError | ParsingError | UndiciError | Error, ServerPlayers>
  > {
    const responseResult = await safeRequest(
      this.makeRequestUrl(serverUrl, "players"),
      {
        dispatcher: this.agent,
        method: "GET",
        headersTimeout: 15_000,
      },
    );

    if (responseResult.isFailure()) {
      return Result.failure(responseResult.error);
    }

    const { value: response } = responseResult;

    const parseResult = await parseAndValidateResponse(
      response,
      GetPlayersSchema,
      {
        parsingErrorMessage: "Failed to parse JSON response from server",
        validationErrorMessage: "Server response does not match expected player data format",
      },
    );

    if (parseResult.isFailure()) {
      return Result.failure(parseResult.error);
    }

    return Result.success(parseResult.value);
  }

  public async close() {
    await this.agent.close();
  }

  private makeRequestUrl(
    serverUrl: string,
    endPoint: "players" | "info",
    protocol: "http" | "https" = "http",
  ): string {
    const endPoints = {
      players: "players.json",
      info: "info.json",
    } as const;

    return `${protocol}://${serverUrl}/${endPoints[endPoint]}`;
  }
}
