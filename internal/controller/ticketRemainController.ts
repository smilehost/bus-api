import { Request, Response } from "express";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { TicketRemainService } from "../service/ticketRemainService";

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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }
}
