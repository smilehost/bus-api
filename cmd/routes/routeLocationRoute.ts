import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteLocationRepository } from "../../internal/repository/routeLocationRepository";
import { RouteLocationService } from "../../internal/service/routeLocationService";
import { LocationController } from "../../internal/controller/routeLocationController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export class RouteLocationRoutes {
  private readonly router: Router;
  
  public repo: RouteLocationRepository;
  public service: RouteLocationService;
  public controller: LocationController;

  constructor(prisma: PrismaClient,comRepo:CompanyRepository) {
    this.router = Router();
    
    this.repo = new RouteLocationRepository(prisma);
    this.service = new RouteLocationService(this.repo, comRepo);
    this.controller = new LocationController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get("/:route_location_id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:route_location_id", this.controller.update.bind(this.controller));
    this.router.delete("/:route_location_id", this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}

