import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TransactionRepository } from "../../internal/repository/transactionRepository";
import { TransactionService } from "../../internal/service/transactionService";
import { TransactionController } from "../../internal/controller/transactionController";
import { CompanyRepository } from "../../internal/repository/companyRepository";
import { MemberRepository } from "../../internal/repository/memberRepository";

export class TransactionRoute {
  private readonly router: Router;

  public repo: TransactionRepository;
  public service: TransactionService;
  public controller: TransactionController;

  constructor(prisma: PrismaClient, comRepo: CompanyRepository) {
    this.router = Router();

    this.repo = new TransactionRepository(prisma);
    const memberRepo = new MemberRepository(prisma);
    this.service = new TransactionService(this.repo, comRepo, memberRepo);
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
