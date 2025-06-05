import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { CompanyRepository } from "../company/companyRepository";
import { ReportController } from "./reportController";
import { ReportRepository } from "./reportRepository";
import { ReportService } from "./reportService";
import { autoInjectable, container } from "tsyringe";

@autoInjectable()
export class ReportRoutes {
  private readonly router: Router;
  public controller: ReportController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(ReportController);
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
