import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { LocationRepository } from "../../internal/repository/locationRepository";
import { LocationService } from "../../internal/service/locationService";
import { LocationController } from "../../internal/controller/locationController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export const LocationRoute = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new LocationRepository(prisma);
  const comRepo = new CompanyRepository(prisma);
  const service = new LocationService(repo, comRepo);
  const controller = new LocationController(service);

  router.get("/all", controller.getAll.bind(controller));
  router.get("/", controller.getByPagination.bind(controller));
  router.get("/:route_location_id", controller.getById.bind(controller));
  router.post("/", controller.create.bind(controller));
  router.put("/:route_location_id", controller.update.bind(controller));
  router.delete("/:route_location_id", controller.delete.bind(controller));

  return router;
};
