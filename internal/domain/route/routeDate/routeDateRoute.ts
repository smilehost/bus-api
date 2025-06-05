import { Router } from "express";
import { container } from "tsyringe";
import { DateController } from "./routeDateController";

export class RouteDateRoutes {
  private readonly router: Router;
  public controller: DateController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(DateController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get("/:route_date_id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:route_date_id", this.controller.update.bind(this.controller));
    this.router.delete("/:route_date_id", this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}