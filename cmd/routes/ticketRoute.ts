// path: cmd/routes/ticketRoute.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TicketRepository } from "../../internal/repository/ticketRepository";
import { TicketService } from "../../internal/service/ticketService";
import { TicketController } from "../../internal/controller/ticketController";
import { TicketRemainService } from "../../internal/service/ticketRemainService";
import { RouteLocationRepository } from "../../internal/repository/routeLocationRepository"; // Added

export class TicketRoute {
  private readonly router: Router;
  public repo: TicketRepository;
  public service: TicketService;
  public controller: TicketController;

  constructor(
    prisma: PrismaClient,
    ticketRemainService: TicketRemainService,
    routeLocationRepository: RouteLocationRepository // Added
  ) {
    this.router = Router();
    this.repo = new TicketRepository(prisma);
    // Updated TicketService instantiation
    this.service = new TicketService(this.repo, ticketRemainService, routeLocationRepository); 
    this.controller = new TicketController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/all",
      this.controller.getByPagination.bind(this.controller)
    );

    this.router.patch(
      "/cancel",
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
