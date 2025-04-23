import { Request, Response } from "express";
import { TimeService } from "../service/timeService";
import { RouteTime } from "../../cmd/models";
import { ExceptionHandler } from "../utils/exception";

interface CreateRouteTimeInput {
  routeTimeName: string;
  routeTimeArray: string[];
  routeTimeComIdd: number;
}

const isValidTimeFormat = (value: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  getByPagination = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = (req.query.search as string) || "";

      if (page < 1 || size < 1) {
        return ExceptionHandler.badRequest(
          res,
          "Invalid pagination parameters"
        );
      }

      const result = await this.timeService.getByPagination(page, size, search);
      res.status(200).json(result);
    } catch (error) {
      ExceptionHandler.internalServerError(res, error);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const comId = parseInt(
        (req.headers["com_id"] || req.headers["com-id"]) as string,
        10
      );
      const routeTimeId = parseInt(req.params.route_time_id, 10);

      if (isNaN(comId)) {
        return ExceptionHandler.badRequest(
          res,
          "Invalid or missing com_id in headers"
        );
      }

      if (isNaN(routeTimeId)) {
        return ExceptionHandler.badRequest(res, "Invalid route_time_id");
      }

      const result = await this.timeService.getById(routeTimeId, comId);

      if (!result) {
        return ExceptionHandler.notFound(res, "Route time not found");
      }

      res.status(200).json(result);
    } catch (error) {
      ExceptionHandler.internalServerError(res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { routeTimeName, routeTimeArray, routeTimeComIdd } =
        req.body as CreateRouteTimeInput;

      if (
        !Array.isArray(routeTimeArray) ||
        !routeTimeArray.every(
          (t) => typeof t === "string" && isValidTimeFormat(t)
        )
      ) {
        return ExceptionHandler.badRequest(
          res,
          'routeTimeArray must be an array of strings in HH:mm format (e.g., "08:30")'
        );
      }

      if (
        typeof routeTimeName !== "string" ||
        typeof routeTimeComIdd !== "number"
      ) {
        return ExceptionHandler.badRequest(
          res,
          "Invalid routeTimeName or routeTimeComIdd"
        );
      }

      const routeTimeString = routeTimeArray.join(",");

      const result = await this.timeService.create({
        route_time_id: 0,
        route_time_name: routeTimeName,
        route_time_array: routeTimeString,
        route_time_com_id: routeTimeComIdd,
      });

      res.status(201).json({ message: "Created successfully", result });
    } catch (error) {
      ExceptionHandler.internalServerError(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const comId = parseInt(
        (req.headers["com_id"] || req.headers["com-id"]) as string,
        10
      );
      const routeTimeId = parseInt(req.params.route_time_id, 10);

      if (isNaN(comId)) {
        return ExceptionHandler.badRequest(
          res,
          "Invalid or missing com_id in headers"
        );
      }

      if (isNaN(routeTimeId)) {
        return ExceptionHandler.badRequest(res, "Invalid route_time_id");
      }

      const body = req.body as Partial<RouteTime>;

      const result = await this.timeService.update(comId, routeTimeId, body);
      res.json(result);
    } catch (error) {
      ExceptionHandler.internalServerError(res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const comId = parseInt(
        (req.headers["com_id"] || req.headers["com-id"]) as string,
        10
      );
      const routeTimeId = parseInt(req.params.route_time_id, 10);

      if (isNaN(comId)) {
        return ExceptionHandler.badRequest(
          res,
          "Invalid or missing com_id in headers"
        );
      }

      if (isNaN(routeTimeId)) {
        return ExceptionHandler.badRequest(res, "Invalid route_time_id");
      }

      const result = await this.timeService.deleteById(comId, routeTimeId);

      if (!result) {
        return ExceptionHandler.notFound(res, "Route time not found");
      }

      res.status(200).json({ message: "Route time deleted successfully" });
    } catch (error) {
      ExceptionHandler.internalServerError(res, error);
    }
  };
}
