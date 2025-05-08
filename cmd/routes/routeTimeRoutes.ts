import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteTimeRepository } from "../../internal/repository/routeTimeRepository";
import { RouteTimeService } from "../../internal/service/routeTimeService";
import { TimeController } from "../../internal/controller/routeTimeController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export class RouteTimeRoutes {
  private router: Router;
  
  public repo: RouteTimeRepository;
  public service: RouteTimeService;
  public controller: TimeController;

  constructor(prisma: PrismaClient,comRepo:CompanyRepository) {
    this.router = Router();
    
    this.repo = new RouteTimeRepository(prisma);
    this.service = new RouteTimeService(this.repo, comRepo);
    this.controller = new TimeController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get("/:route_time_id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:route_time_id", this.controller.update.bind(this.controller));
    this.router.delete("/:route_time_id", this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}


