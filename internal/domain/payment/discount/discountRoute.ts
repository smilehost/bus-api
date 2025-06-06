// path: internal/routes/discountRoutes.ts
import { Router } from "express";
import { container } from "tsyringe";
import { DiscountController } from "./discountController";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";

export class DiscountRoutes {
  private readonly router: Router;
  public controller: DiscountController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(DiscountController);

    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get(
      "/all", authorizeRoles("2","3"),
      this.controller.getAll.bind(this.controller));
    this.router.get(
      "/:ticket_discount_id",authorizeRoles("2","3"),
      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      "/", authorizeRoles("2"),
      this.controller.create.bind(this.controller));
    this.router.put(
      "/:ticket_discount_id",authorizeRoles("2"),
      this.controller.update.bind(this.controller)
    );
    this.router.put(
      "/changeStatus/:ticket_discount_id",authorizeRoles("2"),
      this.controller.changeStatus.bind(this.controller)
    );
    this.router.delete(
      "/:ticket_discount_id",authorizeRoles("2"),
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
