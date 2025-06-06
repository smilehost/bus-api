import { Router } from "express";
import { container } from "tsyringe";
import { CompanyController } from "./companyController";

export class CompanyRoutes {
  private readonly router: Router;
  public controller: CompanyController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(CompanyController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/:com_id", this.controller.getById.bind(this.controller));
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.put("/:com_id", this.controller.update.bind(this.controller));
    this.router.delete("/:com_id", this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}