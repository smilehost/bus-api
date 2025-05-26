import { AppError } from "./appError";
import { Request } from "express";

export class Util {
  static ValidCompany(
    com_id1: number | undefined | null,
    com_id2: number | undefined | null
  ): boolean {
    if (
      com_id1 === null ||
      com_id1 === undefined ||
      isNaN(com_id1) ||
      com_id2 === null ||
      com_id2 === undefined ||
      isNaN(com_id2)
    ) {
      return false;
    }
    return com_id1 === com_id2;
  }

  static parseId(input: unknown, label = "com_id"): number {
    if (input === null || input === undefined) {
      throw AppError.BadRequest(`Missing ${label}`);
    }

    if (Array.isArray(input)) {
      input = input[0];
    }

    if (typeof input === "number") {
      if (!Number.isInteger(input)) {
        throw AppError.BadRequest(`Invalid ${label} (not an integer)`);
      }
      return input;
    }

    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed === "") throw AppError.BadRequest(`Empty ${label} value`);

      if (!/^\d+$/.test(trimmed)) {
        throw AppError.BadRequest(
          `Invalid ${label} (not a pure number string)`
        );
      }

      return parseInt(trimmed, 10);
    }

    throw AppError.BadRequest(`Invalid ${label} format`);
  }

  static parseIdFields(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      try {
        result[key] = Util.parseId(value, key);
      } catch {
        result[key] = value;
      }
    }

    return result;
  }

  static checkObjectHasMissingFields(obj: Record<string, any>): {
    valid: boolean;
    missing: string[];
  } {
    const missing = Object.keys(obj).filter((key) => {
      const value = obj[key];
      return value === undefined || value === null;
    });

    return {
      valid: missing.length === 0,
      missing,
    };
  }

  static extractRequestContext<Body = void, Params = void, Query = void>(
    req: Request,
    require: {
      body?: boolean;
      params?: boolean;
      query?: boolean;
    } = {}
  ): {
    com_id: number;
  } & (Body extends void ? {} : { body: Body }) &
    (Params extends void ? {} : { params: Params }) &
    (Query extends void ? {} : { query: Query }) {
    const com_id = Util.parseId(req.headers["com-id"] || req.headers["com_id"]);
    const result: any = { com_id };

    if (require.body) {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw AppError.BadRequest("Missing required body");
      }
      const check = Util.checkObjectHasMissingFields(req.body);
      if (!check.valid) {
        throw AppError.BadRequest(
          `Missing required fields in body: ${check.missing.join(", ")}`
        );
      }
      result.body = req.body;
    }

    if (require.params) {
      if (!req.params || Object.keys(req.params).length === 0) {
        throw AppError.BadRequest("Missing required params");
      }

      const check = Util.checkObjectHasMissingFields(req.params);
      if (!check.valid) {
        throw AppError.BadRequest(
          `Missing required fields in params: ${check.missing.join(", ")}`
        );
      }

      result.params = Util.parseIdFields(req.params);
    }

    if (require.query) {
      if (!req.query || Object.keys(req.query).length === 0) {
        throw AppError.BadRequest("Missing required query");
      }
      const check = Util.checkObjectHasMissingFields(req.query);
      if (!check.valid) {
        throw AppError.BadRequest(
          `Missing required fields in query: ${check.missing.join(", ")}`
        );
      }

      result.query = Util.parseIdFields(req.query);
    }

    return result;
  }

  static isVaildStatus(status:number){
    if (!(status === 0 || status===1)){
      throw AppError.BadRequest("status must be 0 or 1")
    }
  }
}

export function parseIntOrThrow(value: string | undefined | null, fieldName: string): number {
  if (value === undefined || value === null || value.trim() === "") {
    throw AppError.BadRequest(`${fieldName} is required and cannot be empty.`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw AppError.BadRequest(`Invalid ${fieldName}: not a number.`);
  }
  return parsed;
}

export function parseStringOrThrow(value: string | undefined | null, fieldName: string): string {
  if (value === undefined || value === null || value.trim() === "") {
    throw AppError.BadRequest(`${fieldName} is required and cannot be empty.`);
  }
  return value.trim();
}
