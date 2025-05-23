import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../../internal/repository/routeRepository";
import { RouteService } from "../../internal/service/routeService";
import { RouteController } from "../../internal/controller/routeController";
import { RouteDateRepository } from "../../internal/repository/routeDateRepository";
import { RouteLocationRepository } from "../../internal/repository/routeLocationRepository";

export class RouteRoutes {
  public readonly router: Router;
  public repo: RouteRepository;
  public controller: RouteController;
  public service: RouteService;

  constructor(prisma: PrismaClient, dateRepo: RouteDateRepository) {
    this.router = Router();
    const locationRepo = new RouteLocationRepository(prisma);

    this.repo = new RouteRepository(prisma);
    this.service = new RouteService(this.repo, dateRepo, locationRepo);
    this.controller = new RouteController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get(
      "/:route_id",
      this.controller.getById.bind(this.controller)
    );
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:route_id", this.controller.update.bind(this.controller));
    this.router.delete(
      "/:route_id",
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
