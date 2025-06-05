import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../../route/route/routeRepository";
import { RouteService } from "../../route/route/routeService";
import { TicketRemainRoute } from "../../transaction/ticketRemain/ticketRemainRoute";
import { RouteTicketController } from "./routeTicketController";
import { RouteTicketRepository } from "./routeTicketRepository";
import { RouteTicketService } from "./routeTicketService";

export class RouteTicketRoutes {
  private readonly router: Router;

  public repo: RouteTicketRepository;
  public service: RouteTicketService;
  public controller: RouteTicketController;

  constructor(
    prisma: PrismaClient,
    routeRepo: RouteRepository,
    routeService: RouteService,
    ticketRemain: TicketRemainRoute
  ) {
    this.router = Router();

    this.repo = new RouteTicketRepository(prisma);
    this.service = new RouteTicketService(
      this.repo,
      routeRepo,
      routeService,
      ticketRemain.service
    );
    this.controller = new RouteTicketController(this.service);
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
