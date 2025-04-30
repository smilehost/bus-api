import { Request, Response } from "express";
import { TicketService } from "../service/ticketService";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteTicketWithPrices } from "../../cmd/request";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  async getById(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { route_ticket_id: number }
      >(req, {
        params: true,
      });

      const result = await this.ticketService.getById(
        com_id,
        params.route_ticket_id
      );

      res.status(200).json({
        message: "Ticket retrieved successfully",
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

  async create(req: Request, res: Response) {
    try {
      const { com_id, body } =
        Util.extractRequestContext<RouteTicketWithPrices>(req, {
          body: true,
        });

      const result = await this.ticketService.create(com_id, body);

      res.status(201).json({
        message: "Ticket created successfully",
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
