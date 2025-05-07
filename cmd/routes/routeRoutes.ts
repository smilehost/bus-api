import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../../internal/repository/routeRepository";
import { RouteService } from "../../internal/service/routeService";
import { RouteController } from "../../internal/controller/routeController";
import { RouteDateRepository } from "../../internal/repository/routeDateRepository";
import { RouteTimeRepository } from "../../internal/repository/routeTimeRepository";

export class RouteRoutes {
  public router: Router;
  public repo: RouteRepository;
  public controller: RouteController;
  public service: RouteService;

  private dateRepo: RouteDateRepository;
  private timeRepo: RouteTimeRepository;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.dateRepo = new RouteDateRepository(prisma);
    this.timeRepo = new RouteTimeRepository(prisma);
    
    this.repo = new RouteRepository(prisma);
    this.service = new RouteService(this.repo, this.dateRepo, this.timeRepo);
    this.controller = new RouteController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get("/:route_id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:route_id", this.controller.update.bind(this.controller));
    this.router.delete("/:route_id", this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}

// For backward compatibility and easier migration
export const Route = (prisma: PrismaClient) => {
  const routeRoutes = new RouteRoutes(prisma);
  return routeRoutes.routing();
};
