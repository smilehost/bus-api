import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteTimeRepository } from "../../route/routeTime/routeTimeRepository";
import { TicketRemainController } from "./ticketRemainController";
import { TicketRemainRepository } from "./ticketRemainRepository";
import { TicketRemainService } from "./ticketRemainService";

export class TicketRemainRoute {
  private readonly router: Router;

  public repo: TicketRemainRepository;
  public service: TicketRemainService;
  public controller: TicketRemainController;

  constructor(prisma: PrismaClient, timeRepo: RouteTimeRepository) {
    this.router = Router();

    this.repo = new TicketRemainRepository(prisma);
    this.service = new TicketRemainService(this.repo, timeRepo);
    this.controller = new TicketRemainController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/:ticket_remain_id",
      this.controller.getById.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
