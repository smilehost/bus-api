import { Response } from "express";

export class ExceptionHandler {
  private static extractMessage(error?: unknown): string {
    if (!error) return "Unknown error";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return JSON.stringify(error);
  }

  static badRequest(res: Response, error?: unknown) {
    const message = this.extractMessage(error);
    console.error("Bad Request:", message);
    res.status(400).json({ error: "Bad Request", message });
  }

  static notFound(res: Response, error?: unknown) {
    const message = this.extractMessage(error);
    console.error("Not Found:", message);
    res.status(404).json({ error: "Not Found", message });
  }

  static unauthorized(res: Response, error?: unknown) {
    const message = this.extractMessage(error);
    console.error("Unauthorized:", message);
    res.status(401).json({ error: "Unauthorized", message });
  }

  static forbidden(res: Response, error?: unknown) {
    const message = this.extractMessage(error);
    console.error("Forbidden:", message);
    res.status(403).json({ error: "Forbidden", message });
  }

  static internalServerError(res: Response, error?: unknown) {
    const message = this.extractMessage(error);
    console.error("Internal Server Error:", message);
    res.status(500).json({ error: "Internal Server Error", message });
  }
}
