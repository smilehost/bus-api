import { Request, Response } from "express";
import { RouteTicketWithPrices } from "../../../../cmd/request";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { RouteTicketService } from "./routeTicketService";
import { autoInjectable } from "tsyringe";


@autoInjectable()
export class RouteTicketController {
  constructor(private readonly routeTicketService: RouteTicketService) {}

  async getTicketPricing(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { route_ticket_id: number },
        { ticket_price_type: number }
      >(req, {
        params: true,
      });

      const { ticket, prices } = await this.routeTicketService.getById(
        com_id,
        params.route_ticket_id
      );

      res.status(200).json({
        message: "Ticket retrieved successfully",
        route_ticket: ticket,
        route_ticket_price: prices,
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


  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string;status:number }
      >(req, {
        query: true,
      });

      const result = await this.routeTicketService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search,
        query.status,
      );

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

  async create(req: Request, res: Response) {
    try {
      const { com_id, body } =
        Util.extractRequestContext<RouteTicketWithPrices>(req, {
          body: true,
        });

      const result = await this.routeTicketService.create(com_id, body);

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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
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

      const result = await this.routeTicketService.update(
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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { com_id, body, params } = Util.extractRequestContext<
        {route_ticket_id:number,route_ticket_status:number},
        { route_ticket_id: number }
      >(req, {
        body: true,
        params: true,
      });
      console.log(body,params)
      const result = await this.routeTicketService.updateStatus(
        com_id,
        params.route_ticket_id,
        body.route_ticket_status
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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { route_ticket_id: number }
      >(req, {
        params: true,
      });

      const result = await this.routeTicketService.delete(
        com_id,
        params.route_ticket_id
      );

      res.status(200).json({
        message: "Ticket deleted successfully",
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

  async getAllTicketsByRouteId(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { route_id: number }
      >(req, {
        params: true,
      });

      const result = await this.routeTicketService.getAllTicketsByRouteId(
        com_id,
        params.route_id
      );

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


  async getRouteTicketsByLocations(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<{
        start_location_id: number;
        end_location_id: number;
        date: string;
      }>(req, {
        body: true,
      });

      const result = await this.routeTicketService.getTicketsByLocations(
        com_id,
        body.start_location_id,
        body.end_location_id,
        body.date
      );

      res.status(200).json({
        message: "Routes retrieved successfully",
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
