import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../../internal/repository/routeRepository";
import { RouteService } from "../../internal/service/routeService";
import { RouteController } from "../../internal/controller/routeController";
import { DateRepository } from "../../internal/repository/dateRepository";
import { TimeRepository } from "../../internal/repository/timeRepository";

export const Route = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new RouteRepository(prisma);
  const dateRepo = new DateRepository(prisma);
  const timeRepo = new TimeRepository(prisma);
  const service = new RouteService(repo, dateRepo, timeRepo);
  const controller = new RouteController(service);

  //   router.get("/", controller.getByPagination);
  //   router.get("/:route_time_id", controller.getById);
  router.post("/", controller.create.bind(controller));
  //   router.put("/:route_time_id", controller.update);
  //   router.delete("/:route_time_id", controller.delete);

  return router;
};
