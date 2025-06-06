import { Router } from "express";
import { container } from "tsyringe";
import { CompanyController } from "./companyController";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";

export class CompanyRoutes {
  private readonly router: Router;
  public controller: CompanyController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(CompanyController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all",authorizeRoles("1"), this.controller.getAll.bind(this.controller));
    this.router.get("/:com_id",authorizeRoles("1","2"), this.controller.getById.bind(this.controller));//onlyself
    this.router.post("/",authorizeRoles("1"), this.controller.create.bind(this.controller));
    this.router.put("/:com_id",authorizeRoles("1"), this.controller.update.bind(this.controller));
    this.router.delete("/:com_id",authorizeRoles("1"), this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}