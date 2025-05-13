import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TransactionRepository } from "../../internal/repository/transactionRepository";
import { TransactionService } from "../../internal/service/transactionService";
import { TransactionController } from "../../internal/controller/transactionController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export class TransactionRoute {
  private readonly router: Router;

  public repo: TransactionRepository;
  public service: TransactionService;
  public controller: TransactionController;

  constructor(prisma: PrismaClient, comRepo: CompanyRepository) {
    this.router = Router();

    this.repo = new TransactionRepository(prisma);
    this.service = new TransactionService(this.repo, comRepo);
    this.controller = new TransactionController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post("/", this.controller.create.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}
