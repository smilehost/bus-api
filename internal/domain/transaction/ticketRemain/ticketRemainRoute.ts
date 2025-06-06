import { Router } from "express";
import { TicketRemainController } from "./ticketRemainController";
import { container } from "tsyringe";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";

export class TicketRemainRoute {
  private readonly router: Router;
  public controller: TicketRemainController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(TicketRemainController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/:ticket_remain_id",authorizeRoles("2","3"),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      "/all",authorizeRoles("2","3"), 
      this.controller.getAll.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}