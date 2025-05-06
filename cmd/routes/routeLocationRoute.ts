import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteLocationRepository } from "../../internal/repository/routeLocationRepository";
import { RouteLocationService } from "../../internal/service/routeLocationService";
import { LocationController } from "../../internal/controller/routeLocationController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export const RouteLocation = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new RouteLocationRepository(prisma);
  const comRepo = new CompanyRepository(prisma);
  const service = new RouteLocationService(repo, comRepo);
  const controller = new LocationController(service);

  router.get("/all", controller.getAll.bind(controller));
  router.get("/", controller.getByPagination.bind(controller));
  router.get("/:route_location_id", controller.getById.bind(controller));
  router.post("/", controller.create.bind(controller));
  router.put("/:route_location_id", controller.update.bind(controller));
  router.delete("/:route_location_id", controller.delete.bind(controller));

  return router;
};
