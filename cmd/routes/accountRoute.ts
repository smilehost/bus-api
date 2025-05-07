import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AccountRepository } from "../../internal/repository/accountRepository";
import { AccountService } from "../../internal/service/accountService";
import { AccountController } from "../../internal/controller/accountController";

export const Account = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new AccountRepository(prisma);
  const service = new AccountService(repo);
  const controller = new AccountController(service);

  router.get("/all", controller.getAll.bind(controller));
  router.get("/:account_id", controller.getById.bind(controller));
  router.put("/:account_id", controller.update.bind(controller)); // update can't change account_status and account_password
  router.delete("/:account_id", controller.delete.bind(controller));

  return router;
};
