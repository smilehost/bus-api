import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { RouteTimeRoutes } from "../routes/routeTimeRoutes";
import { RouteRoutes } from "../routes/routeRoutes";
import { AccountRoutes } from "../routes/accountRoute";
import { CompanyRepository } from "../../internal/repository/companyRepository";
import { RouteDateRoutes } from "../routes/routeDateRoute";
import { RouteLocationRoutes } from "../routes/routeLocationRoute";
import { AuthRoutes } from "../routes/AuthRoute";
import { RouteTicketRoutes } from "../routes/routeTicketRoute";
import { TicketRemainRoute } from "../routes/ticketRemainRoute";

export const Routes = (prisma: PrismaClient) => {
  const router = Router();

  const comRepo = new CompanyRepository(prisma);
  const routeDateRoutes = new RouteDateRoutes(prisma);
  const routeTimeRoutes = new RouteTimeRoutes(prisma, comRepo);
  const routeRoutes = new RouteRoutes(
    prisma,
    routeDateRoutes.repo,
    routeTimeRoutes.repo
  );
  const routeLocationRoutes = new RouteLocationRoutes(
    prisma,
    comRepo,
    routeRoutes.service
  );
  const authRoutes = new AuthRoutes(prisma);
  const routeTicketRoutes = new RouteTicketRoutes(prisma, routeRoutes);
  const ticketRemainRoute = new TicketRemainRoute(prisma);
  const accountRoutes = new AccountRoutes(prisma);

  router.use("/route", routeRoutes.routing());
  router.use("/routeDates", routeDateRoutes.routing());
  router.use("/routeTimes", routeTimeRoutes.routing());
  router.use("/routeLocations", routeLocationRoutes.routing());
  router.use("/auth", authRoutes.routing());
  router.use("/routeTicket", routeTicketRoutes.routing());
  router.use("/accounts", accountRoutes.routing());
  router.use("/ticketRemain", ticketRemainRoute.routing());

  return router;
};
