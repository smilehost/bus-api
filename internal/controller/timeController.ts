import { Request, Response } from "express";
import { TimeService } from "../service/timeService";
import { RouteTime } from "../../cmd/models";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";

export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  async getAll(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req);

      const result = await this.timeService.getAll(com_id);

      res.status(200).json({
        message: "Route times retrieved successfully",
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

      const result = await this.timeService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search
      );

      res.status(200).json({
        message: "Route times retrieved successfully",
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
        { route_time_id: number }
      >(req, {
        params: true,
      });

      const result = await this.timeService.getById(
        com_id,
        params.route_time_id
      );

      res.status(200).json({
        message: "Route time retrieved successfully",
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
      const { com_id, body } = Util.extractRequestContext<RouteTime>(req, {
        body: true,
      });

      if (
        !Array.isArray(body.route_time_array?.split(",")) ||
        !body.route_time_array.split(",").every(isValidTimeFormat)
      ) {
        return ExceptionHandler.badRequest(
          res,
          'route_time_array must be a comma-separated string of HH:mm times (e.g., "08:30,09:00")'
        );
      }

      const result = await this.timeService.create(com_id, body);

      res.status(201).json({
        message: "Route time created successfully",
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
        RouteTime,
        { route_time_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.timeService.update(
        com_id,
        params.route_time_id,
        body
      );

      res.status(200).json({
        message: "Route time updated successfully",
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
        { route_time_id: number }
      >(req, {
        params: true,
      });

      await this.timeService.deleteById(com_id, params.route_time_id);

      res.status(200).json({
        message: "Route time deleted successfully",
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

const isValidTimeFormat = (value: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);