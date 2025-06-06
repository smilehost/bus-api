import { Request, Response } from "express";
import { account } from "@prisma/client";
import { JwtPayloadUser } from "../../../../cmd/dto";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { AccountService } from "./accountService";
import { autoInjectable } from "tsyringe";

@autoInjectable()
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

      const user:JwtPayloadUser = (req as any).user
      console.log(user)

      const result = await this.accountService.getByPagination(
        com_id,
        user.account_role,
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
      const { com_id, query } = Util.extractRequestContext<
      void,
      void,
      { com_id:number}
    >(req, {
      query: true,
    });
      const result = await this.accountService.getAll(query.com_id);

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
      const user:JwtPayloadUser = (req as any).user

      const result = await this.accountService.getById(
        com_id,
        user,
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

      const user:JwtPayloadUser = (req as any).user
      const result = await this.accountService.update(
        com_id,
        user,
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
        user,
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
