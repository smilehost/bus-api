import { Router } from "express";
import { TicketPriceTypeController } from "./TicketPriceTypeController";
import { container } from "tsyringe";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";

export class TicketPriceTypeRoute {
  private readonly router: Router;
  public controller: TicketPriceTypeController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(TicketPriceTypeController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/",authorizeRoles("2","3"),
      this.controller.getTicketPriceType.bind(this.controller)
    );
    this.router.post(
      "/",authorizeRoles("2"),
      this.controller.createPriceType.bind(this.controller)
    );
    this.router.put(
      "/:route_ticket_price_type_id",authorizeRoles("2"),
      this.controller.editPriceType.bind(this.controller)
    );
    this.router.delete(
      "/:route_ticket_price_type_id",authorizeRoles("2"),
      this.controller.deletePriceType.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
