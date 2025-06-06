import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import { AuthRoutes } from "../../internal/domain/account/auth/AuthRoute";
import { AccountRoutes } from "../../internal/domain/account/account/accountRoute";
import { CompanyRoutes } from "../../internal/domain/company/company/companyRoute";

import { RouteRoutes } from "../../internal/domain/route/route/routeRoutes";
import { RouteDateRoutes } from "../../internal/domain/route/routeDate/routeDateRoute";
import { RouteTimeRoutes } from "../../internal/domain/route/routeTime/routeTimeRoutes";
import { RouteLocationRoutes } from "../../internal/domain/route/routeLocation/routeLocationRoute";
import { RouteTicketRoutes } from "../../internal/domain/routeTicket/routeTicket/routeTicketRoute";
import { TicketPriceTypeRoute } from "../../internal/domain/routeTicket/ticketPriceType/ticketPriceTypeRoute";
import { TicketRemainRoute } from "../../internal/domain/transaction/ticketRemain/ticketRemainRoute";
import { MemberRoute } from "../../internal/domain/company/member/memberRoute";
import { TransactionRoute } from "../../internal/domain/transaction/transaction/transactionRoute";
import { DiscountRoutes } from "../../internal/domain/payment/discount/discountRoute";
import { PaymentMethodRoutes } from "../../internal/domain/payment/payment/paymentMethodRoute";
import { TicketRoute } from "../../internal/domain/transaction/ticket/ticketRoute";
import { DeviceRoutes } from "../../internal/domain/company/device/deviceRoute";
import { ReportRoutes } from "../../internal/domain/company/report/reportRoutes.ts";
import { CompanyRepository } from "../../internal/domain/company/company/companyRepository";
import { TransactionTimeoutJob } from "../crons/transactionCron";


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
  // Updated TicketRoute instantiation
  const ticketRoutes = new TicketRoute(prisma, ticketRemainRoute.service, routeLocationRoutes.repo) 
  const transactionRoutes = new TransactionRoute(
    prisma,
    comRepo,
    ticketRemainRoute.service,
    paymentMethodRoute.service,
    ticketRoutes.service
  );

  // Report
  const reportRoutes = new ReportRoutes(prisma, comRepo);

  //cron jobs
  //TransactionTimeoutJob(transactionRoutes.service)

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
  router.use("/report", reportRoutes.routing());

  return router;
};
