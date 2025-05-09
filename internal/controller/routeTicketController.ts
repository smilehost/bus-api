import { Request, Response } from "express";
import { RouteTicketService } from "../service/routeTicketService";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteTicketWithPrices } from "../../cmd/request";
import { RouteTicketPriceType } from "../../cmd/models";

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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async getTicketPriceType(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req, {});

      const result = await this.routeTicketService.getTicketPriceType(com_id);

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

  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string }
      >(req, {
        query: true,
      });

      const result = await this.routeTicketService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search
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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      console.log("-------------1");

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
      }
      ExceptionHandler.internalServerError(res, error);
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
      }
      ExceptionHandler.internalServerError(res, error);
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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async createPriceType(req: Request, res: Response) {
    try {
      console.log("-------------1");
      
      const { com_id, body } = Util.extractRequestContext<RouteTicketPriceType>(
        req,
        { body: true }
      );
      const result = await this.routeTicketService.createPriceType(
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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async deletePriceType(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { route_ticket_price_type_id: number }
      >(req, { params: true });
      const result = await this.routeTicketService.deletePriceType(
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
      }
      ExceptionHandler.internalServerError(res, error);
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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }
}
