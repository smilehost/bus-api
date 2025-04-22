import { Request, Response } from "express";
import { TimeService } from "../service/timeService";
import { RouteTime } from "../../cmd/models";

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
        res.status(400).json({ error: "Invalid pagination parameters" });
        return;
      }

      const result = await this.timeService.getByPagination(page, size, search);

      res.status(200).json(result);
      return;
    } catch (error) {
      console.error("Error in getByPagination:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const comIdHeader = req.headers["com_id"] || req.headers["com-id"];
      const comId = parseInt(comIdHeader as string, 10);

      // ✅ ตรวจสอบ com_id ก่อนใช้งาน
      if (isNaN(comId)) {
        res.status(400).json({ error: "Invalid or missing com_id in headers" });
        return;
      }

      const routeTimeId = parseInt(req.params.route_time_id, 10);

      // ✅ ตรวจสอบ route_time_id
      if (isNaN(routeTimeId)) {
        res.status(400).json({ error: "Invalid route_time_id" });
        return;
      }

      // ✅ เรียกใช้งาน service พร้อม com_id
      const result = await this.timeService.getById(routeTimeId, comId);

      if (!result) {
        res.status(404).json({ error: "Route time not found" });
        return;
      }

      res.status(200).json(result);
      return;
    } catch (error) {
      console.error("Error in get:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { routeTimeName, routeTimeArray, routeTimeComIdd } =
        req.body as CreateRouteTimeInput;

      // ✅ ตรวจว่าเป็น string[]
      if (
        !Array.isArray(routeTimeArray) ||
        !routeTimeArray.every(
          (t) => typeof t === "string" && isValidTimeFormat(t)
        )
      ) {
        res.status(400).json({
          error:
            'Invalid input: routeTimeArray must be an array of strings in HH:mm format (e.g., "08:30")',
        });
        return;
      }

      // ✅ ตรวจชื่อและบริษัท ID
      if (
        typeof routeTimeName !== "string" ||
        typeof routeTimeComIdd !== "number"
      ) {
        res
          .status(400)
          .json({ error: "Invalid routeTimeName or routeTimeComIdd" });
        return;
      }

      // ✅ แปลง array เป็น string เช่น '"08:00","09:30"'
      const routeTimeString = routeTimeArray.map((t) => `${t}`).join(",");

      // ✅ ส่งเข้า service
      const result = await this.timeService.create({
        route_time_id: 0,
        route_time_name: routeTimeName,
        route_time_array: routeTimeString,
        route_time_com_id: routeTimeComIdd,
      });

      res.status(201).json({
        message: "Created successfully",
        result,
      });
      return;
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const comIdHeader = req.headers["com_id"] || req.headers["com-id"];
      const comId = parseInt(comIdHeader as string, 10);

      // ✅ ตรวจสอบ com_id ก่อนใช้งาน
      if (isNaN(comId)) {
        res.status(400).json({ error: "Invalid or missing com_id in headers" });
        return;
      }

      const routeTimeId = parseInt(req.params.route_time_id, 10);

      if (isNaN(routeTimeId)) {
        res.status(400).json({ error: "Invalid route_time_id" });
        return;
      }

      const body = req.body as Partial<RouteTime>;

      const result = await this.timeService.update(comId, routeTimeId, body);

      res.json(result);
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const comIdHeader = req.headers["com_id"] || req.headers["com-id"];
      const comId = parseInt(comIdHeader as string, 10);

      // ✅ ตรวจสอบ com_id ก่อนใช้งาน
      if (isNaN(comId)) {
        res.status(400).json({ error: "Invalid or missing com_id in headers" });
        return;
      }

      const routeTimeId = parseInt(req.params.route_time_id, 10);

      if (isNaN(routeTimeId)) {
        res.status(400).json({ error: "Invalid route_time_id" });
        return;
      }

      const result = await this.timeService.deleteById(comId, routeTimeId);

      if (!result) {
        res.status(404).json({ error: "Route time not found" });
        return;
      }

      res.status(200).json({ message: "Route time deleted successfully" });
      return;
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };
}
