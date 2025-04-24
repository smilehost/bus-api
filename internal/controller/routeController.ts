import { Request, Response } from "express";
import { RouteService } from "../service/routeService";
import { Route } from "../../cmd/models";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";

export class RouteController {
  constructor(private readonly routeService: RouteService) {}

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
      console.log("--------------------1");
      const { com_id, body, params } = Util.extractRequestContext<
        Route,
        { route_id: number }
      >(req, {
        body: true,
        params: true,
      });
      
      console.log("--------------------2");
      const updatedRoute = await this.routeService.update(
        com_id,
        params.route_id,
        body
      );
      console.log("--------------------3");

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
}
