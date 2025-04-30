import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteTimeRepository } from "../../internal/repository/routeTimeRepository";
import { RouteTimeService } from "../../internal/service/routeTimeService";
import { TimeController } from "../../internal/controller/routeTimeController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export const RouteTime = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new RouteTimeRepository(prisma);
  const comRepo = new CompanyRepository(prisma);
  const service = new RouteTimeService(repo, comRepo);
  const controller = new TimeController(service);

  router.get("/all", controller.getAll.bind(controller));
  router.get("/", controller.getByPagination.bind(controller));
  router.get("/:route_time_id", controller.getById.bind(controller));
  router.post("/", controller.create.bind(controller));
  router.put("/:route_time_id", controller.update.bind(controller));
  router.delete("/:route_time_id", controller.delete.bind(controller));

  return router;
};
