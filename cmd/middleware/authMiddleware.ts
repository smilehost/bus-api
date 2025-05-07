import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../../internal/utils/jwt";

interface JwtPayload {
  account_id: number;
  account_role: string;
}

export interface JwtPayloadUser {
  account_id: number;
  account_role: string;
  com_id: number;
  login_at: number;
  iat: number;
  exp: number;
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      console.log("=====================1");

      const decoded = verifyJwt(token) as JwtPayload;
      console.log(decoded);

      console.log("=====================4");

      if (!allowedRoles.includes(decoded.account_role)) {
        console.log("=====================2");

        res.status(403).json({ message: "Access denied: insufficient role" });
        return;
      }
      console.log("=====================3");

      //   req.body.user = decoded;
      (req as any).user = decoded;
      console.log("=====================5");
      const user = (req as any).user;
      console.log(user);
      console.log("=====================");

      next();
    } catch (err) {
      console.log(err);
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  };
};
