import { Response } from "express";

export class ExceptionHandler {

  static badRequest(res: Response, error?: unknown) {
    if (error) {
      console.error("Bad Request:", error);
    }
    res.status(400).json({ error: "Bad Request" });
  }

  static notFound(res: Response, error?: unknown) {
    if (error) {
      console.error("Not Found:", error);
    }
    res.status(404).json({ error: "Not Found" });
  }

  static unauthorized(res: Response, error?: unknown) {
    if (error) {
      console.error("Unauthorized:", error);
    }
    res.status(401).json({ error: "Unauthorized" });
  }

  static forbidden(res: Response, error?: unknown) {
    if (error) {
      console.error("Forbidden:", error);
    }
    res.status(403).json({ error: "Forbidden" });
  }
  
  static internalServerError(res: Response, error?: unknown) {
    if (error) {
      console.error("Internal Server Error:", error);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
}
