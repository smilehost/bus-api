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
}
