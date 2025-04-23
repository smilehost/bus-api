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
  static Internal(msg: string) {
    return new AppError(msg, 500);
  }
}
