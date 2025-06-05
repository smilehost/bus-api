import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { CompanyController } from "./companyController";
import { CompanyService } from "./companyService";
import { CompanyRepository } from "./companyRepository";

export class CompanyRoutes {
  private readonly router: Router;
  public repo: CompanyRepository;
  public service: CompanyService;
  public controller: CompanyController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new CompanyRepository(prisma);
    this.service = new CompanyService(this.repo);
    this.controller = new CompanyController(this.service);

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/:com_id", this.controller.getById.bind(this.controller));
    
    this.router.get("/:com_id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:com_id", this.controller.update.bind(this.controller));
    this.router.delete(
      "/:com_id",
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
