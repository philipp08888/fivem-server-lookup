import { Result } from "@philipp08888/utils";
import z from "zod";
import { $ZodIssue } from "zod/v4/core";

export interface Violation {
  path: string;
  message: string;
}

export class ValidationError extends Error {
  public readonly violations: Array<Violation>;

  public constructor(message: string, issues: Array<$ZodIssue>) {
    super(message);
    this.name = "ValidationError";
    this.violations = this.makeViolations(issues);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  private makeViolations(issues: Array<$ZodIssue>): Array<Violation> {
    return issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join("."),
    }));
  }
}

export class ParsingError extends Error {
  public readonly cause?: Error;

  public constructor(message: string, cause?: Error) {
    super(message);
    this.name = "ParsingError";
    this.cause = cause;

    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}

export async function parseAndValidateResponse<T>(
  response: { body: { json: () => Promise<unknown> } },
  schema: z.ZodSchema<T>,
  options?: {
    parsingErrorMessage?: string;
    validationErrorMessage?: string;
  },
): Promise<Result<ValidationError | ParsingError, T>> {
  let bodyJson: unknown;

  try {
    bodyJson = await response.body.json();
  } catch (error) {
    return Result.failure(
      new ParsingError(
        options?.parsingErrorMessage ?? "Error while parsing response",
        error instanceof Error ? error : undefined,
      ),
    );
  }

  const validatedResponse = schema.safeParse(bodyJson);

  if (!validatedResponse.success) {
    return Result.failure(
      new ValidationError(
        options?.validationErrorMessage ?? "Error while validating data against schema",
        validatedResponse.error.issues,
      ),
    );
  }

  return Result.success(validatedResponse.data);
}
