import { Request, Response } from "express";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { TicketRemainService } from "./ticketRemainService";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class TicketRemainController {
  constructor(private readonly ticketRemainService: TicketRemainService) {}

  async getById(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        {
          ticket_remain_id: string;
        }
      >(req, {
        params: true,
      });

      const result = await this.ticketRemainService.getById(
        com_id,
        params.ticket_remain_id
      );

      res.status(200).json({
        message: "Ticket remain retrieved successfully",
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
  async getAll(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<string[]>(req, {
        body: true,
      });

      console.log("Received ticket_remain_ids:", body);

      const result = await this.ticketRemainService.getAll(
        body
      );

      console.log("Retrieved ticket remains:", result);
      

      res.status(200).json({
        message: "Ticket remains retrieved successfully",
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
