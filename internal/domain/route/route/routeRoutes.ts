import { Router } from "express";
import { container } from "tsyringe";
import { RouteController } from "./routeController";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";

export class RouteRoutes {
  public readonly router: Router;
  public controller: RouteController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(RouteController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/", authorizeRoles("2","3"),
      this.controller.getByPagination.bind(this.controller));
    this.router.get(
      "/:route_id", authorizeRoles("2","3"),
      this.controller.getById.bind(this.controller));
    this.router.post(
      "/",authorizeRoles("2"), 
      this.controller.create.bind(this.controller));
    this.router.put(
      "/:route_id", authorizeRoles("2"),
      this.controller.update.bind(this.controller));
    this.router.delete(
      "/:route_id",authorizeRoles("2"), 
      this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}