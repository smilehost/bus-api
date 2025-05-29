// path: internal/controller/ticketController.ts
import { Request, Response } from "express";
import { TicketService } from "../service/ticketService";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { ExceptionHandler } from "../utils/exception";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<void,void,
        {page: number; size: number; search: string, status: string }
      >(req, {query: true,});

      const result = await this.ticketService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search,
        query.status
      )

      res.status(200).json({
        message: "Tickets retrieved successfully",
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

  async cancelTicket(req: Request, res: Response) {
    try {
      const { com_id, body} = Util.extractRequestContext<
        {ticket_uuid:string,ticket_note:string}
      >(req, {body:true});

      const result = await this.ticketService.cancelTicket(body.ticket_uuid,body.ticket_note)
      res.status(200).json({
        message: "Tickets cancelled successfully",
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
}
