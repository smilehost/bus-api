import { Request, Response } from "express";
import { route_ticket_price_type } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { TicketPriceTypeService } from "./TicketPriceTypeService";


export class TicketPriceTypeController {
  constructor(private readonly ticketPriceTypeService: TicketPriceTypeService) {}

  async getTicketPriceType(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req, {});

      const result = await this.ticketPriceTypeService.getTicketPriceType(com_id);

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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async createPriceType(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<route_ticket_price_type>(
        req,
        { body: true }
      );
      const result = await this.ticketPriceTypeService.createPriceType(
        com_id,
        body
      );
      
      res.status(201).json({
        message: "Ticket price type created successfully",
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

  async editPriceType(req: Request, res: Response) {
    try {
      const { com_id,body, params } = Util.extractRequestContext<
        {route_ticket_price_type_name:string},
        { route_ticket_price_type_id: number }
      >(req, { params: true,body:true });

      const result = await this.ticketPriceTypeService.editPriceType(
        com_id,
        params.route_ticket_price_type_id,
        body.route_ticket_price_type_name
      );
      res.status(200).json({
        message: "Ticket price type deleted successfully",
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

  async deletePriceType(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { route_ticket_price_type_id: number }
      >(req, { params: true });
      const result = await this.ticketPriceTypeService.deletePriceType(
        com_id,
        params.route_ticket_price_type_id
      );
      res.status(200).json({
        message: "Ticket price type deleted successfully",
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
