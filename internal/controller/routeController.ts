import { Request, Response } from "express";
import { RouteService } from "../service/routeService";
import { Route } from "../../cmd/models";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";

export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string }
      >(req, {
        query: true,
      });

      const result = await this.routeService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search
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

  async getById(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        Route,
        { route_id: number }
      >(req, {
        params: true,
      });

      const route = await this.routeService.getById(com_id, params.route_id);

      res.status(200).json({
        message: "Route retrieved successfully",
        result: route,
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
      const { com_id, body } = Util.extractRequestContext<Route>(req, {
        body: true,
      });

      const createdRoute = await this.routeService.create(com_id, body);

      res.status(201).json({
        message: "Route created successfully",
        result: createdRoute,
      });

      res.status(201).json({
        message: "Route created successfully",
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
        Route,
        { route_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const updatedRoute = await this.routeService.update(
        com_id,
        params.route_id,
        body
      );

      res.status(200).json({
        message: "Route updated successfully",
        result: updatedRoute,
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
        Route,
        { route_id: number }
      >(req, {
        params: true,
      });

      await this.routeService.delete(com_id, params.route_id);

      res.status(200).json({
        message: "Route deleted successfully",
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
