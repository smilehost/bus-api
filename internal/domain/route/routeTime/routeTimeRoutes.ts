import { Router } from "express";
import { TimeController } from "./routeTimeController";
import { container } from "tsyringe";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";

export class RouteTimeRoutes {
  private readonly router: Router;
  public controller: TimeController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(TimeController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/all", authorizeRoles("2","3"),
      this.controller.getAll.bind(this.controller));
    this.router.get(
      "/", authorizeRoles("2","3"),
      this.controller.getByPagination.bind(this.controller));
    this.router.get(
      "/:route_time_id",authorizeRoles("2","3"),
      this.controller.getById.bind(this.controller));
    this.router.post(
      "/",authorizeRoles("2"), 
      this.controller.create.bind(this.controller));
    this.router.put(
      "/:route_time_id",authorizeRoles("2"),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      "/:route_time_id",authorizeRoles("2"),
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
