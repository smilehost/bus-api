import { Router } from "express";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";
import { AccountController } from "./accountController";
import { container } from "tsyringe";

export class AccountRoutes {
  private readonly router: Router;
  public controller: AccountController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(AccountController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/", authorizeRoles("1", "2"), this.controller.getByPagination.bind(this.controller));
    this.router.get("/all", authorizeRoles("1","2"), this.controller.getAll.bind(this.controller));
    this.router.get("/:account_id", authorizeRoles("1", "2"), this.controller.getById.bind(this.controller));
    this.router.put("/:account_id", authorizeRoles("1", "2"), this.controller.update.bind(this.controller));
    this.router.delete("/:account_id", authorizeRoles("1", "2"), this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}