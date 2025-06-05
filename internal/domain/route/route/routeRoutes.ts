import { Router } from "express";
import { container } from "tsyringe";
import { RouteController } from "./routeController";

export class RouteRoutes {
  public readonly router: Router;
  public controller: RouteController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(RouteController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get("/:route_id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:route_id", this.controller.update.bind(this.controller));
    this.router.delete("/:route_id", this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}