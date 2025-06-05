import { Router } from "express";
import { RouteTicketController } from "./routeTicketController";
import { container } from "tsyringe";

export class RouteTicketRoutes {
  private readonly router: Router;
  private readonly controller: RouteTicketController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(RouteTicketController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/route/:route_id",
      this.controller.getAllTicketsByRouteId.bind(this.controller)
    );
    this.router.get(
      "/all",
      this.controller.getByPagination.bind(this.controller)
    );
    this.router.get(
      "/ticket/:route_ticket_id",
      this.controller.getTicketPricing.bind(this.controller)
    );

    this.router.post("/create", this.controller.create.bind(this.controller));
    this.router.put(
      "/:route_ticket_id",
      this.controller.update.bind(this.controller)
    );
    this.router.put(
      "/:route_ticket_id/status",
      this.controller.updateStatus.bind(this.controller)
    );

    this.router.delete(
      "/:route_ticket_id",
      this.controller.delete.bind(this.controller)
    );

    this.router.post(
      "/getRouteTicketsByLocations",
      this.controller.getRouteTicketsByLocations.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
