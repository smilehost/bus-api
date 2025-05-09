import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteTicketRepository } from "../../internal/repository/routeTicketRepository";
import { RouteTicketService } from "../../internal/service/routeTicketService";
import { RouteTicketController } from "../../internal/controller/routeTicketController";
import { RouteRoutes } from "../routes/routeRoutes";

export class RouteTicketRoutes {
  private readonly router: Router;

  public repo: RouteTicketRepository;
  public service: RouteTicketService;
  public controller: RouteTicketController;

  constructor(prisma: PrismaClient, routeRoutes: RouteRoutes) {
    this.router = Router();
    
    this.repo = new RouteTicketRepository(prisma);
    this.service = new RouteTicketService(this.repo, routeRoutes.repo, routeRoutes.service);
    this.controller = new RouteTicketController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/route/:route_id", this.controller.getAllTicketsByRouteId.bind(this.controller));
    this.router.get("/all", this.controller.getByPagination.bind(this.controller));
    this.router.get("/ticket/:route_ticket_id", this.controller.getTicketPricing.bind(this.controller));
    
    this.router.post("/create", this.controller.create.bind(this.controller));
    this.router.put("/:route_ticket_id", this.controller.update.bind(this.controller));
    this.router.delete("/:route_ticket_id", this.controller.delete.bind(this.controller));

    this.router.get("/priceType", this.controller.getTicketPriceType.bind(this.controller));
    this.router.post("/priceType", this.controller.createPriceType.bind(this.controller));
    this.router.delete("/priceType/:route_ticket_price_type_id", this.controller.deletePriceType.bind(this.controller));

    this.router.post("/getRouteTicketsByLocations", this.controller.getRouteTicketsByLocations.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}

// For backward compatibility
export const RouteTicket = (prisma: PrismaClient, routeRoutes: RouteRoutes) => {
  const routeTicketRoutes = new RouteTicketRoutes(prisma, routeRoutes);
  return routeTicketRoutes.routing();
};
