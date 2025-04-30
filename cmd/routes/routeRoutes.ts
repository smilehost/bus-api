import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../../internal/repository/routeRepository";
import { RouteService } from "../../internal/service/routeService";
import { RouteController } from "../../internal/controller/routeController";
import { DateRepository } from "../../internal/repository/routeDateRepository";
import { TimeRepository } from "../../internal/repository/routeTimeRepository";

export const Route = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new RouteRepository(prisma);
  const dateRepo = new DateRepository(prisma);
  const timeRepo = new TimeRepository(prisma);
  const service = new RouteService(repo, dateRepo, timeRepo);
  const controller = new RouteController(service);

  router.get("/", controller.getByPagination.bind(controller));
  router.get("/:route_id", controller.getById.bind(controller));
  router.post("/", controller.create.bind(controller));
  router.put("/:route_id", controller.update.bind(controller));
  router.delete("/:route_id", controller.delete.bind(controller));

  return router;
};
