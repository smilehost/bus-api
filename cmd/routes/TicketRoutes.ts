import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { TicketRepository } from "../../internal/repository/ticketRepository";
import { TicketService } from "../../internal/service/ticketService";
import { TicketController } from "../../internal/controller/ticketController";

export const Ticket = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new TicketRepository(prisma);
  const service = new TicketService(repo);
  const controller = new TicketController(service);

  // router.get("/all", controller.getAll.bind(controller));
  // router.get("/", controller.getByPagination.bind(controller));
  // router.get("/:route_time_id", controller.getById.bind(controller));
  // router.post("/", controller.create.bind(controller));
  // router.put("/:route_time_id", controller.update.bind(controller));
  // router.delete("/:route_time_id", controller.delete.bind(controller));

  return router;
};
