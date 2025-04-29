import { account } from "@prisma/client";
import { AuthService } from "../service/authService";
import { AppError } from "../utils/appError";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { Request, Response } from "express";


const LOGIN_LIFT_TIME = Number(process.env.LOGIN_LIFT_TIME) ?? 12

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    async login(req: Request, res: Response) {
        try {
            const body = req.body

            if (!body.username || !body.password){
                throw AppError.BadRequest("username and password can't be empty")
            }

            const token = await this.authService.login(body.username,body.password,LOGIN_LIFT_TIME)

            res.cookie('token',token,{
                maxAge: 3600 * 1000 * Number(LOGIN_LIFT_TIME),
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
              })

            return res.status(200).json({ message: 'Login successful' });

        } catch (error) {
            if (error instanceof AppError) {
              res.status(error.statusCode).json({
                error: error.name,
                message: error.message,
              });
            }
            ExceptionHandler.internalServerError(res, error);
        }
    }

    logout(req: Request, res: Response) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: false,      // only over HTTPS
                sameSite: "strict" // or "lax", depending on your setup
            });
            res.status(200).json({ message: "Logged out successfully" });

        } catch (error) {
            if (error instanceof AppError) {
              res.status(error.statusCode).json({
                error: error.name,
                message: error.message,
              });
            }
            ExceptionHandler.internalServerError(res, error);
        }
    }

    async register(req: Request, res: Response) {
        try {
            const { com_id, body } = Util.extractRequestContext<account>(req, {
                body: true,
            });
            
            if(!body.account_name||
            !body.account_password||
            !body.account_role||
            !body.account_username){
                throw AppError.BadRequest("Request these fied:name,password,role,username")
            }

            if(body.account_role === "1"){
                throw AppError.Forbidden("Forbidden to create this user")
            }

            const data = await this.authService.register(com_id,body)
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
            }
            ExceptionHandler.internalServerError(res, error);
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { com_id, body } = Util.extractRequestContext<account>(req, {
                body: true,
            });

            if (!body.account_id||!body.account_password){
                throw AppError.BadRequest("request id and password")
            }

            const data = await this.authService.changePassword(com_id,
                                                               body.account_id,
                                                               body.account_password)

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
              }
            ExceptionHandler.internalServerError(res, error);
        }
    }
}