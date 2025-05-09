import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TicketRemainRepository } from "../../internal/repository/ticketRemainRepository";

import { TicketRemainController } from "../../internal/controller/ticketRemainController";
import { TicketRemainService } from "../../internal/service/ticketRemainService";

export class TicketRemainRoute {
  private readonly router: Router;

  public repo: TicketRemainRepository;
  public service: TicketRemainService;
  public controller: TicketRemainController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new TicketRemainRepository(prisma);
    this.service = new TicketRemainService(this.repo);
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
