import { Account } from "../../cmd/models";
import { AuthService } from "../service/authService";
import { AppError } from "../utils/appError";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { Request, Response } from "express";


export class AuthController {
    constructor(private readonly authService: AuthService) { }

    login(req: Request, res: Response) {
        try {
            const body = req.body

            if (!body.username || !body.password){
                throw AppError.BadRequest("username and password can't be empty")
            }

            const user = this.authService.login(body.username,body.password)

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

    }

    register(req: Request, res: Response) {

    }

    reset(req: Request, res: Response) {

    }
}