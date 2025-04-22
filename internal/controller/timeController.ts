import { Request, Response } from "express";
import { TimeService } from "../service/timeService";

interface CreateRouteTimeInput {
  routeTimeName: string;
  routeTimeArray: string[];
  routeTimeComIdd: number;
}

const isValidTimeFormat = (value: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  create = async (req: Request, res: Response) => {
    try {
      const { routeTimeName, routeTimeArray, routeTimeComIdd } = req.body as CreateRouteTimeInput;

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
}
