import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { PaymentMethodController } from "./paymentMethodController";
import { PaymentMethodRepository } from "./PaymentMethodRepository";
import { PaymentMethodService } from "./paymentMethodService";

export class PaymentMethodRoutes {
  private readonly router: Router;

  public repo: PaymentMethodRepository;
  public service: PaymentMethodService;
  public controller: PaymentMethodController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new PaymentMethodRepository(prisma);
    this.service = new PaymentMethodService(this.repo);
    this.controller = new PaymentMethodController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/",
      this.controller.createPaymentMethod.bind(this.controller)
    );
    this.router.get(
      "/",
      this.controller.getAllPaymentMethods.bind(this.controller)
    );
    this.router.get(
      "/:payment_method_id",
      this.controller.getPaymentMethodById.bind(this.controller)
    );
    this.router.put(
      "/:payment_method_id",
      this.controller.updatePaymentMethod.bind(this.controller)
    );
    this.router.delete(
      "/:payment_method_id",
      this.controller.deletePaymentMethod.bind(this.controller)
    );
    this.router.patch(
      "/:payment_method_id/status",
      this.controller.changeStatus.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
