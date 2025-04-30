import { Request, Response } from "express";
import { TicketService } from "../service/ticketService";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteTicketWithPrices } from "../../cmd/request";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  async getTicketPriceType(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req, {});

      const result = await this.ticketService.getTicketPriceType(com_id);
      
      res.status(200).json({
        message: "Ticket price types retrieved successfully",
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

  async update(req: Request, res: Response) {
    try {
      const { com_id, body, params } = Util.extractRequestContext<
        RouteTicketWithPrices,
        { route_ticket_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.ticketService.update(
        com_id,
        params.route_ticket_id,
        body
      );

      res.status(200).json({
        message: "Ticket updated successfully",
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
