import { Router } from "express";
import { LocationController } from "./routeLocationController";
import { container } from "tsyringe";

export class RouteLocationRoutes {
  private readonly router: Router;
  public controller: LocationController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(LocationController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get(
      "/:route_location_id",
      this.controller.getById.bind(this.controller)
    );
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put(
      "/:route_location_id",
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      "/:route_location_id",
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
