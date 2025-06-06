import { Request, Response } from "express";
import { route_location } from "@prisma/client";
import { RouteLocationService } from "./routeLocationService";
import { Util } from "../../../utils/util";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class LocationController {
  constructor(private readonly routeLocationService: RouteLocationService) {}

  async getAll(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req);

      const result = await this.routeLocationService.getAll(com_id);

      res.status(200).json({
        message: "Route locations retrieved successfully",
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

  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string }
      >(req, {
        query: true,
      });

      const result = await this.routeLocationService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search
      );

      res.status(200).json({
        message: "Route locations retrieved successfully",
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

  async getById(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { route_location_id: number }
      >(req, {
        params: true,
      });

      const result = await this.routeLocationService.getById(
        com_id,
        params.route_location_id
      );

      res.status(200).json({
        message: "Route location retrieved successfully",
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
      const { com_id, body } = Util.extractRequestContext<route_location>(req, {
        body: true,
      });

      const result = await this.routeLocationService.create(com_id, body);

      res.status(201).json({
        message: "Route location created successfully",
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
        route_location,
        { route_location_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.routeLocationService.update(
        com_id,
        params.route_location_id,
        body
      );

      res.status(200).json({
        message: "Route location updated successfully",
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
        { route_location_id: number }
      >(req, {
        params: true,
      });

      await this.routeLocationService.delete(com_id, params.route_location_id);

      res.status(200).json({
        message: "Route location deleted successfully",
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
