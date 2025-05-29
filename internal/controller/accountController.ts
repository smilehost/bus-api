import { Request, Response } from "express";
import { AccountService } from "../service/accountService";
import { Util } from "../utils/util";
import { ExceptionHandler } from "../utils/exception";
import { AppError } from "../utils/appError";
import { JwtPayloadUser } from "../../cmd/dto";
import { account } from "@prisma/client";

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string; status: number; }
      >(req, {
        query: true,
      });

      const result = await this.accountService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search,
        query.status
      );

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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { account_id: number }
      >(req, {
        params: true,
      });

      const result = await this.accountService.getById(
        com_id,
        params.account_id
      );
      res.status(200).json({
        message: "Account retrieved successfully",
        result,
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

  async update(req: Request, res: Response) {
    try {
      const { com_id, params, body } = Util.extractRequestContext<
        account,
        { account_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.accountService.update(
        com_id,
        params.account_id,
        body
      );

      res.status(200).json({
        message: "Account updated successfully",
        result,
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

  async delete(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { account_id: number }
      >(req, {
        params: true,
      });

      const user = (req as any).user as JwtPayloadUser;

      await this.accountService.delete(
        com_id,
        user.account_id,
        params.account_id
      );

      res.status(200).json({
        message: "Account deleted successfully"
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
