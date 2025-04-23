import { Prisma } from "@prisma/client";

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = AppError.getHttpErrorName(statusCode);
    Error.captureStackTrace(this, this.constructor);
  }

  private static getHttpErrorName(code: number): string {
    const map: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      500: "Internal Server Error",
    };
    return map[code] ?? "Error";
  }

  static BadRequest(msg: string) {
    return new AppError(msg, 400);
  }
  static Unauthorized(msg: string) {
    return new AppError(msg, 401);
  }
  static Forbidden(msg: string) {
    return new AppError(msg, 403);
  }
  static NotFound(msg: string) {
    return new AppError(msg, 404);
  }
  static Conflict(msg: string) {
    return new AppError(msg, 409);
  }
  static Internal(msg: string) {
    return new AppError(msg, 500);
  }

  static fromPrismaError(error: unknown): AppError {
    if (error instanceof Prisma.PrismaClientValidationError) {
      // ✅ ลองจับข้อความ field ที่หายจากข้อความ raw
      const fieldMatch = RegExp(/Argument `(\w+)` is missing/).exec(error.message);

      if (fieldMatch) {
        const missingField = fieldMatch[1];
        return AppError.BadRequest(`Missing required field: ${missingField}`);
      }

      return AppError.BadRequest("Invalid input data");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return AppError.Conflict(
            `Duplicate value for unique field(s): ${(
              error.meta?.target as string[]
            )?.join(", ")}`
          );
        case "P2025":
          return AppError.NotFound(error.message || "Record not found");
      }

      return AppError.BadRequest("Invalid request to database");
    }

    return AppError.Internal("Unexpected database error");
  }
}
