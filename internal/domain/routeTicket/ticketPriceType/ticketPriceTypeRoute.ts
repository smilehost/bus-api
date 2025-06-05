import { Router } from "express";
import { TicketPriceTypeController } from "./TicketPriceTypeController";
import { container } from "tsyringe";

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
      "/",
      this.controller.getTicketPriceType.bind(this.controller)
    );
    this.router.post(
      "/",
      this.controller.createPriceType.bind(this.controller)
    );
    this.router.put(
      "/:route_ticket_price_type_id",
      this.controller.editPriceType.bind(this.controller)
    );
    this.router.delete(
      "/:route_ticket_price_type_id",
      this.controller.deletePriceType.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
