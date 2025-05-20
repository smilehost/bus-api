import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../../internal/utils/jwt";
import { AppError } from "../../internal/utils/appError";
import { ExceptionHandler } from "../../internal/utils/exception";

interface JwtPayload {
  account_id: number;
  account_role: string;
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyJwt(token) as JwtPayload;

      if (!allowedRoles.includes(decoded.account_role)) {
        res.status(403).json({ message: "Access denied: insufficient role" });
        return;
      }

      (req as any).user = decoded;

      // how to use this
      // const user = (req as any).user;
      console.log(req.body)
      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  };
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next))
      .catch((error) => {
        console.error("Error in controller:", error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Internal server error" });
        }
      });
  };
};


