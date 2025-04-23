import { Request, Response } from "express";
import { RouteService } from "../service/routeService";
import { Route } from "../../cmd/models";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";

export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  async create(req: Request, res: Response) {
    try {
      const comId = Util.parseId(
        req.headers["com-id"] || req.headers["com_id"]
      );

      if (comId === null) {
        return ExceptionHandler.badRequest(
          res,
          "Invalid or missing com_id in headers"
        );
      }

      const {
        route_name_th,
        route_name_en,
        route_color,
        route_status,
        route_com_id,
        date_id,
        time_id,
        route_array,
      } = req.body as Route;
      
      const route: Route = {
        route_id: 0,
        route_name_th,
        route_name_en,
        route_color,
        route_status,
        route_com_id,
        date_id,
        time_id,
        route_array,
      };


      // ✅ ตรวจว่า field ไหนขาด
      const check = Util.checkObjectHasMissingFields(route);

      if (!check.valid) {
        return ExceptionHandler.badRequest(
          res,
          `Missing required fields: ${check.missing.join(", ")}`
        );
      }

      const createdRoute = await this.routeService.create(comId, route);

      res.status(201).json({
        message: "Route created successfully",
        result: createdRoute,
      });
    } catch (error) {
      ExceptionHandler.internalServerError(res, error);
    }
  }
}
