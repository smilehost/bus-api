// path: cmd/routes/ticketRoute.ts
import { Router } from "express";
import { container } from "tsyringe";
import { TicketController } from "./ticketController";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";

export class TicketRoute {
  private readonly router: Router;
  public controller: TicketController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(TicketController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/all",authorizeRoles("2","3"),
      this.controller.getByPagination.bind(this.controller)
    );

    this.router.patch(
      "/cancel",authorizeRoles("2","3"),
      this.controller.cancelTicket.bind(this.controller)
    );

    // Added new route
    this.router.get(
      "/viewticket/:ticket_uuid",
      this.controller.viewTicketByUuid.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
