import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TimeRepository } from "../../internal/repository/timeRepository";
import { TimeService } from "../../internal/service/timeService";
import { TimeController } from "../../internal/controller/timeController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export const TimeRoutes = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new TimeRepository(prisma);
  const comRepo = new CompanyRepository(prisma);
  const service = new TimeService(repo, comRepo);
  const controller = new TimeController(service);

  router.get("/all", controller.getAll.bind(controller));
  router.get("/", controller.getByPagination.bind(controller));
  router.get("/:route_time_id", controller.getById.bind(controller));
  router.post("/", controller.create.bind(controller));
  router.put("/:route_time_id", controller.update.bind(controller));
  router.delete("/:route_time_id", controller.delete.bind(controller));

  return router;
};
