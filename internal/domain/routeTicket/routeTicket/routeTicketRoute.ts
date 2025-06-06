import { Router } from "express";
import { RouteTicketController } from "./routeTicketController";
import { container } from "tsyringe";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";


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
      "/route/:route_id",authorizeRoles("2","3"),
      this.controller.getAllTicketsByRouteId.bind(this.controller));
    this.router.get(
      "/all",authorizeRoles("2","3"),
      this.controller.getByPagination.bind(this.controller));
    this.router.get(
      "/ticket/:route_ticket_id",authorizeRoles("2","3"),
      this.controller.getTicketPricing.bind(this.controller));
    this.router.post(
      "/create",authorizeRoles("2"), 
      this.controller.create.bind(this.controller));
    this.router.put(
      "/:route_ticket_id", authorizeRoles("2"),
      this.controller.update.bind(this.controller));
    this.router.put(
      "/:route_ticket_id/status",authorizeRoles("2"),
      this.controller.updateStatus.bind(this.controller));
    this.router.delete(
      "/:route_ticket_id",authorizeRoles("2"),
      this.controller.delete.bind(this.controller));
    this.router.post(
      "/getRouteTicketsByLocations",authorizeRoles("2","3"),
      this.controller.getRouteTicketsByLocations.bind(this.controller));
    this.router.post(
      "/getPricebylocation",authorizeRoles("2","3"),
      this.controller.getTicketPriceByLocation.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}
