import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";
import { AccountController } from "./accountController";
import { AccountRepository } from "./accountRepository";
import { AccountService } from "./accountService";

export class AccountRoutes {
  private readonly router: Router;

  public repo: AccountRepository;
  public service: AccountService;
  public controller: AccountController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new AccountRepository(prisma);
    this.service = new AccountService(this.repo);
    this.controller = new AccountController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/", authorizeRoles("1","2"),this.controller.getByPagination.bind(this.controller));
    this.router.get("/all",authorizeRoles("1"), this.controller.getAll.bind(this.controller));
    this.router.get(
      "/:account_id",authorizeRoles("2","1"),
      this.controller.getById.bind(this.controller)
    );
    this.router.put(
      "/:account_id",authorizeRoles("2","1"),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      "/:account_id",authorizeRoles("2","1"),
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}


