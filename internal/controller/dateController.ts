import { Request, Response } from "express";
import { DateService } from "../service/dateService";
import { RouteDate } from "../../cmd/models";
import { Util } from "../utils/util";
import { ExceptionHandler } from "../utils/exception";
import { AppError } from "../utils/appError";

export class DateController {
  constructor(private readonly dateService: DateService) {}

  async getByPagination(req: Request, res: Response) {
    try {
      const {com_id, query} = Util.extractRequestContext<
        void,
        void,
        {page:number; size: number; search:string}
      >(req,{
        query:true
      })

      const data = await this.dateService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search
      );

      res.status(200).json({
        message: "Dates retrieved successfully",
        result: data,
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
        RouteDate,
        { route_date_id:number}
      >(req, {
        params: true,
      });
      
      const data = await this.dateService.getById(com_id,params.route_date_id);
      if (!data) {
        res.status(404).json({ error: "Data not found" });
        return;
      }

      res.status(200).json({
        message: "Route retrieved successfully",
        result: data,
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
  };

  async create(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<RouteDate>(req, {
        body: true,
      });

      const data = await this.dateService.create(com_id, body);

      res.status(201).json({
        message: "Date created successfully",
        result: data,
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
  };

  async update(req: Request, res: Response) {
    try {
      const { com_id, body, params } = Util.extractRequestContext<
        RouteDate,
        { route_date_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const data = await this.dateService.update(
        com_id,
        params.route_date_id,
        body
      );

      res.status(200).json({
        message: "Date updated successfully",
        result: data,
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
        RouteDate,
        { route_date_id: number }
      >(req, {
        params: true,
      });

      await this.dateService.delete(com_id, params.route_date_id);

      res.status(200).json({
        message: "Date deleted successfully",
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
