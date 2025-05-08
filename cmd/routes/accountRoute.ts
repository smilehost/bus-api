import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AccountRepository } from "../../internal/repository/accountRepository";
import { AccountService } from "../../internal/service/accountService";
import { AccountController } from "../../internal/controller/accountController";

export class AccountRoutes {
  private router: Router;

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
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get("/:account_id", this.controller.getById.bind(this.controller));
    this.router.put("/:account_id", this.controller.update.bind(this.controller)); // update can't change account_status and account_password
    this.router.delete("/:account_id", this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}

// For backward compatibility
export const Account = (prisma: PrismaClient) => {
  const accountRoutes = new AccountRoutes(prisma);
  return accountRoutes.routing();
};
