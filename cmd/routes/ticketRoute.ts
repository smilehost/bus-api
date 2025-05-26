// path: cmd/routes/ticketRoute.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TicketRepository } from "../../internal/repository/ticketRepository";
import { TicketService } from "../../internal/service/ticketService";
import { TicketController } from "../../internal/controller/ticketController";

export class TicketRoute {
  private readonly router: Router;
  public repo: TicketRepository;
  public service: TicketService;
  public controller: TicketController;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.repo = new TicketRepository(prisma);
    this.service = new TicketService(this.repo);
    this.controller = new TicketController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Routes for ticket endpoints will be added here
    // Example: this.router.get("/", this.controller.getAllTickets.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}

