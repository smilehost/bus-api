import { Request, Response } from "express";
import { DateService } from "../service/dateService";
import { RouteDate } from "../../cmd/models";

export class DateController {
  constructor(private readonly dateService: DateService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.dateService.getAll();
      if (!data || data.length === 0) {
        res.status(404).json({ error: "No data found" });
        return;
      }
      res.json(data);
    } catch (error) {
      console.error("Error in getAll:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const data = await this.dateService.getById(id);
      if (!data) {
        res.status(404).json({ error: "Data not found" });
        return;
      }

      res.json(data);
    } catch (error) {
      console.error("Error in getById:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const body = req.body as RouteDate;

      // Basic validation
      if (
        !body.route_date_name ||
        !body.route_date_start ||
        !body.route_date_end
      ) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const data = await this.dateService.create(body);
      res.status(201).json(data);
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({ error: "Failed to create route_date" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const body = req.body as Partial<RouteDate>;
      const data = await this.dateService.update(id, body);

      res.json(data);
    } catch (error) {
      console.error("Error in update:", error);
      res.status(500).json({ error: "Failed to update route_date" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      await this.dateService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error in delete:", error);
      res.status(500).json({ error: "Failed to delete route_date" });
    }
  };
}
