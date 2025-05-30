import { AuthService } from "../service/authService";
import { AppError } from "../utils/appError";
import { ExceptionHandler } from "../utils/exception";
import { Request, Response } from "express";
import { Util } from "../utils/util";

export interface RegisterAccount {
  name: string;
  username: string;
  password: string;
  role: string;
}

const LOGIN_LIFT_TIME = Number(process.env.LOGIN_LIFT_TIME) || 168;

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response) {
    try {
      const body = req.body;

      if (!body.username || !body.password) {
        throw AppError.BadRequest("username and password can't be empty");
      }

      const token = await this.authService.login(
        body.username,
        body.password,
        LOGIN_LIFT_TIME
      );

      res.setHeader("Authorization", `Bearer ${token}`);
      // res.cookie("token", token, {2
      //   maxAge: 3600 * 1000 * Number(LOGIN_LIFT_TIME),
      //   httpOnly: true,
      //   secure: true, // ✅ ตอนนี้ใช้ได้แล้ว เพราะเราใช้ HTTPS
      //   sameSite: "none", // ✅ ต้องใช้คู่กับ secure สำหรับ cross-origin
      // });

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  logout(req: Request, res: Response) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false, // only over HTTPS
        sameSite: "strict", // or "lax", depending on your setup
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<RegisterAccount>(
        req,{body: true,}
      );

      if (!body.name || !body.password || !body.role || !body.username) {
        throw AppError.BadRequest(
          "Request these fied:name,password,role,username"
        );
      }

      if (body.role === "1") {
        throw AppError.Forbidden("Forbidden to create this user");
      }

      const data = await this.authService.register(com_id, body);
      res.status(201).json({
        message: "User created successfully",
        result: data,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<{
        userId: number;
        newPassword: string;
      }>(req, {
        body: true,
      });
      const changer = (req as any).user;

      if (!body.userId || !body.newPassword) {
        throw AppError.BadRequest("request id and password");
      }

      const data = await this.authService.changePassword(
        com_id,
        body.userId,
        body.newPassword,
        changer
      );

      res.status(200).json({
        message: "Change User password successfully",
        result: data,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
      
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<{
        userId: number;
        newStatus: number;
      }>(req, {
        body: true,
      });

      const changer = (req as any).user;

      const data = await this.authService.changeStatus(
        com_id,
        body.userId,
        body.newStatus,
        changer
      );

      res.status(200).json({
        message: "Change User status successfully",
        result: data,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }
}
