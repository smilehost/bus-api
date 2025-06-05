import { Router } from "express";
import { TimeController } from "./routeTimeController";
import { container } from "tsyringe";

export class RouteTimeRoutes {
  private readonly router: Router;
  public controller: TimeController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(TimeController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get(
      "/:route_time_id",
      this.controller.getById.bind(this.controller)
    );
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put(
      "/:route_time_id",
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      "/:route_time_id",
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
