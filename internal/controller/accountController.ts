import { Request, Response } from "express";
import { AccountService } from "../service/accountService";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  async getAll(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req);

      const result = await this.accountService.getAll(com_id);

      res.status(200).json({
        message: "Accounts retrieved successfully",
        result,
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