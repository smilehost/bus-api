import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { CompanyRepository } from "../../internal/repository/companyRepository";
import { ReportRepository } from "../../internal/repository/reportRepository";
import { ReportService } from "../../internal/service/reportService";
import { ReportController } from "../../internal/controller/reportController";

export class ReportRoutes {
  private readonly router: Router;

  public repo: ReportRepository;
  public service: ReportService;
  public controller: ReportController;

  constructor(prisma: PrismaClient, comRepo: CompanyRepository) {
    this.router = Router();

    this.repo = new ReportRepository(prisma);
    this.service = new ReportService(this.repo, comRepo);
    this.controller = new ReportController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/:choice",
      this.controller.getReport.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
