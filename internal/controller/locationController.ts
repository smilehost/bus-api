import { Request, Response } from "express";
import { LocationService } from "../service/locationService";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteLocation } from "../../cmd/models";
import { number } from "zod";

export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  async getAll(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req);

      const result = await this.locationService.getAll(com_id);

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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async getByPagination(req: Request, res: Response) {
    try {
      console.log("------3");
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string }
      >(req, {
        query: true,
      });
      console.log("------4");

      const result = await this.locationService.getByPagination(
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
      }
      ExceptionHandler.internalServerError(res, error);
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

      const result = await this.locationService.getById(
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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<RouteLocation>(req, {
        body: true,
      });

      const result = await this.locationService.create(com_id, body);

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
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { com_id, body, params } = Util.extractRequestContext<
        RouteLocation,
        { route_location_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.locationService.update(
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
      }
      ExceptionHandler.internalServerError(res, error);
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

      await this.locationService.delete(com_id, params.route_location_id);

      res.status(200).json({
        message: "Route location deleted successfully",
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
