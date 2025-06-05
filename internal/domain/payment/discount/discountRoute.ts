// path: internal/routes/discountRoutes.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { DiscountController } from "./discountController";
import { DiscountRepository } from "./discountRepository";
import { DiscountService } from "./discountService";

export class DiscountRoutes {
  private readonly router: Router;

  public repo: DiscountRepository;
  public service: DiscountService;
  public controller: DiscountController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new DiscountRepository(prisma);
    this.service = new DiscountService(this.repo);
    this.controller = new DiscountController(this.service);

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
