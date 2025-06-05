import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TicketPriceTypeRepository } from "./TicketPriceTypeRespository";
import { TicketPriceTypeController } from "./TicketPriceTypeController";
import { TicketPriceTypeService } from "./TicketPriceTypeService";

export class TicketPriceTypeRoute {
  private readonly router: Router;

  public repo: TicketPriceTypeRepository;
  public service: TicketPriceTypeService;
  public controller: TicketPriceTypeController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new TicketPriceTypeRepository(prisma);
    this.service = new TicketPriceTypeService(this.repo);
    this.controller = new TicketPriceTypeController(this.service);
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
