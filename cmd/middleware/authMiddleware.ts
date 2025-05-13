import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../../internal/utils/jwt";

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

      next();
    } catch (err) {
      console.log(err);
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  };
};
