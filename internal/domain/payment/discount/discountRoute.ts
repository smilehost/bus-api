// path: internal/routes/discountRoutes.ts
import { Router } from "express";
import { container } from "tsyringe";
import { DiscountController } from "./discountController";

export class DiscountRoutes {
  private readonly router: Router;
  public controller: DiscountController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(DiscountController);

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get(
      "/:ticket_discount_id",
      this.controller.getById.bind(this.controller)
    );
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put(
      "/:ticket_discount_id",
      this.controller.update.bind(this.controller)
    );
    this.router.put(
      "/changeStatus/:ticket_discount_id",
      this.controller.changeStatus.bind(this.controller)
    );
    this.router.delete(
      "/:ticket_discount_id",
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
