import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { uploadSlipImage } from "../../../../cmd/middleware/fileUploadMiddleware";
import { TicketService } from "../ticket/ticketService";
import { DeviceRepository } from "../../company/device/deviceRepository"; // Added import
import { DeviceService } from "../../company/device/deviceService"; // Added import
import { verifyDevice } from "../../../../cmd/middleware/deviceAuthMiddleware"; // Added import
import { asyncHandler, authorizeRoles } from "../../../../cmd/middleware/authMiddleware"; // Added import for asyncHandler
import { CompanyRepository } from "../../company/company/companyRepository";
import { PaymentMethodService } from "../../payment/payment/paymentMethodService";
import { TicketRemainService } from "../ticketRemain/ticketRemainService";
import { TransactionController } from "./transactionController";
import { TransactionRepository } from "./transactionRepository";
import { TransactionService } from "./transactionService";

export class TransactionRoute {
  private readonly router: Router;

  public repo: TransactionRepository;
  public service: TransactionService;
  public controller: TransactionController;
  public deviceService: DeviceService; // Added property

  constructor(
    prisma: PrismaClient,
    comRepo: CompanyRepository,
    ticketRemainService: TicketRemainService,
    paymentMethodService: PaymentMethodService,
    ticketService: TicketService,
  ) {
    this.router = Router();

    const deviceRepository = new DeviceRepository(prisma); // Instantiated
    this.deviceService = new DeviceService(deviceRepository); // Instantiated
    this.repo = new TransactionRepository(prisma);
    this.service = new TransactionService(
      this.repo,
      comRepo,
      ticketRemainService,
      paymentMethodService,
      ticketService
    );
    this.controller = new TransactionController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    //this.router.use(asyncHandler(verifyDevice(this.deviceService))); // Apply middleware to all routes in this router, wrapped with asyncHandler

    this.router.post("/",
      authorizeRoles("1","2","3"),verifyDevice(this.deviceService), 
      this.controller.create.bind(this.controller));
    this.router.get(
      "/pollTransactionStatus/:transaction_id",
      this.controller.checkingByPolling.bind(this.controller)
    );
    this.router.post(
      "/confirmAndPrint/:transaction_id",
      uploadSlipImage,authorizeRoles("1","2","3"),verifyDevice(this.deviceService),
      this.controller.confirmAndPrint.bind(this.controller)
    );
    this.router.post(
      "/callback/gateway",
      this.controller.transactionCallbackGateWay.bind(this.controller)
    );
    this.router.post(
      "/callback/static",
      authorizeRoles("1","2","3"),verifyDevice(this.deviceService),
      this.controller.transactionCallbackStatic.bind(this.controller)
    );
    this.router.get(
      "/position",
      this.controller.getTransactionPosition.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
