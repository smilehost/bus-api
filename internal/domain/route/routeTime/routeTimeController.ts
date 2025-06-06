import { Request, Response } from "express";
import { route_time } from "@prisma/client";
import { RouteTimeRequest } from "../../../../cmd/request";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { RouteTimeService } from "./routeTimeService";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class TimeController {
  constructor(private readonly routeTimeService: RouteTimeService) {}

  async getAll(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req);

      const result = await this.routeTimeService.getAll(com_id);

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

      const result = await this.routeTimeService.getByPagination(
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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
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

      const result = await this.routeTimeService.getById(
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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<RouteTimeRequest>(
        req,
        {
          body: true,
        }
      );

      const result = await this.routeTimeService.create(com_id, body);

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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { com_id, body, params } = Util.extractRequestContext<
        route_time,
        { route_time_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.routeTimeService.update(
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
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
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

      await this.routeTimeService.deleteById(com_id, params.route_time_id);

      res.status(200).json({
        message: "Route time deleted successfully",
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

const isValidTimeFormat = (value: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
