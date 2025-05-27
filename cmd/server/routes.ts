import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthRoutes } from "../routes/AuthRoute";
import { AccountRoutes } from "../routes/accountRoute";
import { CompanyRoutes } from "../routes/companyRoute";
import { CompanyRepository } from "../../internal/repository/companyRepository";

import { RouteRoutes } from "../routes/routeRoutes";
import { RouteDateRoutes } from "../routes/routeDateRoute";
import { RouteTimeRoutes } from "../routes/routeTimeRoutes";
import { RouteLocationRoutes } from "../routes/routeLocationRoute";
import { RouteTicketRoutes } from "../routes/routeTicketRoute";
import { TicketPriceTypeRoute } from "../routes/ticketPriceTypeRoute";
import { TicketRemainRoute } from "../routes/ticketRemainRoute";
import { MemberRoute } from "../routes/memberRoute";
import { TransactionRoute } from "../routes/transactionRoute";
import { DiscountRoutes } from "../routes/discountRoute";
import { PaymentMethodRoutes } from "../routes/paymentMethodRoute";
import { TicketRoute } from "../routes/ticketRoute";
import { DeviceRoutes } from "../routes/deviceRoute";


export const Routes = (prisma: PrismaClient): Router => {
  const router = Router();
  const comRepo = new CompanyRepository(prisma);

  // Auth & Account
  const authRoutes = new AuthRoutes(prisma);
  const accountRoutes = new AccountRoutes(prisma);
  const deviceRoutes = new DeviceRoutes(prisma)

  // Company
  const companyRoutes = new CompanyRoutes(prisma);

  // Route core
  const routeDateRoutes = new RouteDateRoutes(prisma);
  const routeTimeRoutes = new RouteTimeRoutes(prisma, comRepo);
  const routeRoutes = new RouteRoutes(prisma, routeDateRoutes.repo);

  // Route submodules
  const routeLocationRoutes = new RouteLocationRoutes(
    prisma,
    comRepo,
    routeRoutes.service
  );
  const ticketRemainRoute = new TicketRemainRoute(prisma, routeTimeRoutes.repo);
  const routeTicketRoutes = new RouteTicketRoutes(
    prisma,
    routeRoutes.repo,
    routeRoutes.service,
    ticketRemainRoute
  );
  const ticketPriceTypeRoute = new TicketPriceTypeRoute(prisma);

  // Transaction
  const memberRoutes = new MemberRoute(prisma, comRepo);
  const discountRoutes = new DiscountRoutes(prisma)
  const paymentMethodRoute = new PaymentMethodRoutes(prisma)
  const ticketRoutes = new TicketRoute(prisma)
  const transactionRoutes = new TransactionRoute(
    prisma,
    comRepo,
    ticketRemainRoute.service,
    paymentMethodRoute.service,
    ticketRoutes.service
  );

  // Mount routes
  router.use("/auth", authRoutes.routing());
  router.use("/accounts", accountRoutes.routing());
  router.use("/company", companyRoutes.routing());

  router.use("/route", routeRoutes.routing());
  router.use("/routeDates", routeDateRoutes.routing());
  router.use("/routeTimes", routeTimeRoutes.routing());
  router.use("/routeLocations", routeLocationRoutes.routing());
  router.use("/routeTicket", routeTicketRoutes.routing());

  router.use("/ticketRemain", ticketRemainRoute.routing());
  router.use("/ticketPriceType", ticketPriceTypeRoute.routing());
  router.use("/paymentMethod", paymentMethodRoute.routing());
  router.use("/transaction", transactionRoutes.routing());
  router.use("/ticket", ticketRoutes.routing()); // Added ticket route
  router.use("/ticketdiscount", discountRoutes.routing());
  router.use("/device", deviceRoutes.routing());

  return router;
};
