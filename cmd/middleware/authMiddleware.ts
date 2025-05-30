import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../../internal/utils/jwt";
import { JwtPayloadUser } from "../dto";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyJwt(token) as JwtPayloadUser;
      console.log(decoded,allowedRoles)

      if (!allowedRoles.includes(decoded.account_role)) {
        console.log(decoded.account_role)
        res.status(403).json({ message: "Access denied: insufficient role" });
        return;
      }

      (req as any).user = decoded;
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


