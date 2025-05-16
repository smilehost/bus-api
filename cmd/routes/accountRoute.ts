import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AccountRepository } from "../../internal/repository/accountRepository";
import { AccountService } from "../../internal/service/accountService";
import { AccountController } from "../../internal/controller/accountController";
import { authorizeRoles } from "../middleware/authMiddleware";

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
    this.router.get("/", this.controller.getByPagination.bind(this.controller));
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get(
      "/:account_id",
      this.controller.getById.bind(this.controller)
    );
    this.router.put(
      "/:account_id",
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      "/:account_id",
      this.controller.delete.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}

export const Account = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new AccountRepository(prisma);
  const service = new AccountService(repo);
  const controller = new AccountController(service);

  router.get("/all", controller.getAll.bind(controller));
  router.get("/", controller.getByPagination.bind(controller));
  router.get("/:account_id", controller.getById.bind(controller));
  router.put("/:account_id", controller.update.bind(controller));
  router.delete(
    "/:account_id",
    authorizeRoles("1"),
    controller.delete.bind(controller)
  );

  return router;
};
