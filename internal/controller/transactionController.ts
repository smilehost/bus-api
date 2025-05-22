import { Request, Response } from "express";
import { TransactionService } from "../service/transactionService";
import { ExceptionHandler } from "../utils/exception";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { CreateTicketDto, CreateTransactionTicketsDto } from "../../cmd/dto";

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  async create(req: Request, res: Response) {
    try {
      
      const { com_id, body } = Util.extractRequestContext<CreateTransactionTicketsDto>(req, {
        body: true,
      });
      const result = await this.transactionService.create(com_id, body);

      res.status(201).json({
        message: "Transaction created successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else {
          ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async checkingByPolling(req: Request, res: Response){
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,{
          transaction_id: number;
        }>(req, {params: true });

      const result = await this.transactionService.checkingByPolling(com_id, params.transaction_id);

      res.status(201).json({
        message: "Transaction created successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else {
          ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async transactionCallbackGateWay(req: Request, res: Response){
    try {
      const { com_id, body } = Util.extractRequestContext<{
        transaction_id:number,
        status:string
      }>(req, {body: true,});

      await this.transactionService.transactionCallbackGateWay(body.transaction_id,body.status);

      res.status(200).json({
        message: "ok"
      });
    } catch (error) {
      console.log(error)
      res.status(200).json({
        message: "ok"
      });
    }
  }

  async transactionCallbackStatic(req: Request, res: Response){
    try {
      const { com_id, body } = Util.extractRequestContext<{
        transaction_id:number,
        status:string
      }>(req, {body: true});

      await this.transactionService.transactionCallbackStatic(body.transaction_id,body.status);

      res.status(200).json({
        message: "ok"
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else {
          ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async confirmAndPrint(req: Request, res: Response) {
    try {
      const { com_id, body,params } = Util.extractRequestContext<
        CreateTicketDto[],{
          transaction_id: number;
        }
      >(req, {
        body:true,
        params: true,
      });

      // Get the file from the request (handled by multer middleware)
      if (!req.file) {
        throw AppError.BadRequest("Slip image is required");
      }

      const result = await this.transactionService.confirmAndPrint(
        com_id,
        params.transaction_id,
        body,
        req.file
      );

      res.status(200).json({
        message: "Slip image uploaded successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }
}
