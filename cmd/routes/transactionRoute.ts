import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TransactionRepository } from "../../internal/repository/transactionRepository";
import { TransactionService } from "../../internal/service/transactionService";
import { TransactionController } from "../../internal/controller/transactionController";
import { CompanyRepository } from "../../internal/repository/companyRepository";
import { MemberRepository } from "../../internal/repository/memberRepository";
import { TicketRemainService } from "../../internal/service/ticketRemainService";
import { PaymentMethodService } from "../../internal/service/paymentMethodService";
import { PaymentMethodRepository } from "../../internal/repository/PaymentMethodRepository";
import { uploadSlipImage } from "../middleware/fileUploadMiddleware";

export class TransactionRoute {
  private readonly router: Router;

  public repo: TransactionRepository;
  public service: TransactionService;
  public controller: TransactionController;

  constructor(
    prisma: PrismaClient,
    comRepo: CompanyRepository,
    memberRepo: MemberRepository,
    ticketRemainService: TicketRemainService,
    paymentMethodService: PaymentMethodService
  ) {
    this.router = Router();

    this.repo = new TransactionRepository(prisma);
    this.service = new TransactionService(
      this.repo,
      comRepo,
      memberRepo,
      ticketRemainService,
      paymentMethodService
    );
    this.controller = new TransactionController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.post(
      "/pollTransactionStatus/:transaction_id",
      this.controller.CheckingByPolling.bind(this.controller)
    );
    this.router.post(
      "/confirmAndPrint/:transaction_id",
      uploadSlipImage,
      this.controller.confirmAndPrint.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
