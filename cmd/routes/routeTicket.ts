import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { RouteTicketRepository } from "../../internal/repository/routeTicketRepository";
import { RouteTicketService } from "../../internal/service/routeTicketService";
import { RouteTicketController } from "../../internal/controller/routeTicketController";
import { RouteRepository } from "../../internal/repository/routeRepository";

export const RoutesTicket = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new RouteTicketRepository(prisma);
  const routeRepo = new RouteRepository(prisma);
  const service = new RouteTicketService(repo,routeRepo);
  const controller = new RouteTicketController(service);

  router.get("/all/:route_id", controller.getAllTicketsByRouteId.bind(controller));
  router.get("/priceType", controller.getTicketPriceType.bind(controller));
  router.get("/", controller.getByPagination.bind(controller));
  router.get("/:route_ticket_id", controller.getById.bind(controller));
  router.post("/", controller.create.bind(controller));
  router.put("/:route_ticket_id", controller.update.bind(controller));
  // router.delete("/:route_ticket_id", controller.delete.bind(controller));
  
  router.get("/routeticket/route/:route_id");
  router.get("/routeticket/all");
  router.get("/routeticket/ticket/:route_ticket_id");
  
  router.post("/routeticket/create");

  router.put("/routeticket/:route_ticket_id");
  
  router.delete("/routeticket/:route_ticket_id");

  return router;
};
