import { Router } from "express";
import { container } from "tsyringe";
import { TransactionController } from "./transactionController";
import { DeviceService } from "../../company/device/deviceService";
import { verifyDevice } from "../../../../cmd/middleware/deviceAuthMiddleware";
import { uploadSlipImage } from "../../../../cmd/middleware/fileUploadMiddleware";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";
import { TransactionService } from "./transactionService";

export class TransactionRoute {
  private readonly router: Router;
  public service: TransactionService;
  public controller: TransactionController;
  public deviceService: DeviceService;

  constructor() {
    this.router = Router();

    this.service = container.resolve(TransactionService);
    this.controller = container.resolve(TransactionController);
    this.deviceService = container.resolve(DeviceService); // ✅ inject ผ่าน tsyringe ด้วย

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/",
      authorizeRoles("1", "2", "3"),
      verifyDevice(this.deviceService),
      this.controller.create.bind(this.controller)
    );

    this.router.get(
      "/pollTransactionStatus/:transaction_id",
      this.controller.checkingByPolling.bind(this.controller)
    );

    this.router.post(
      "/confirmAndPrint/:transaction_id",
      uploadSlipImage,
      authorizeRoles("1", "2", "3"),
      verifyDevice(this.deviceService),
      this.controller.confirmAndPrint.bind(this.controller)
    );

    this.router.post(
      "/callback/gateway",
      this.controller.transactionCallbackGateWay.bind(this.controller)
    );

    this.router.post(
      "/callback/static",
      authorizeRoles("1", "2", "3"),
      verifyDevice(this.deviceService),
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
