import { Router } from "express";
import { container } from "tsyringe";
import { PaymentMethodController } from "./paymentMethodController";

export class PaymentMethodRoutes {
  private readonly router: Router;
  public controller: PaymentMethodController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(PaymentMethodController);
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
