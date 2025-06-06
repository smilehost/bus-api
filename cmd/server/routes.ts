// src/routes/index.ts
import { Router } from "express";
import { container } from "tsyringe";

// ✅ import class route ทั้งหมด
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
import { TransactionTimeoutJob } from "../crons/transactionCron";

export const Routes = (): Router => {
  const router = Router();

  // ✅ resolve ด้วย container
  const authRoutes = container.resolve(AuthRoutes);
  const accountRoutes = container.resolve(AccountRoutes);
  const companyRoutes = container.resolve(CompanyRoutes);
  const routeRoutes = container.resolve(RouteRoutes);
  const routeDateRoutes = container.resolve(RouteDateRoutes);
  const routeTimeRoutes = container.resolve(RouteTimeRoutes);
  const routeLocationRoutes = container.resolve(RouteLocationRoutes);
  const routeTicketRoutes = container.resolve(RouteTicketRoutes);
  const ticketRemainRoute = container.resolve(TicketRemainRoute);
  const ticketPriceTypeRoute = container.resolve(TicketPriceTypeRoute);
  const memberRoutes = container.resolve(MemberRoute);
  const discountRoutes = container.resolve(DiscountRoutes);
  const paymentMethodRoute = container.resolve(PaymentMethodRoutes);
  const ticketRoutes = container.resolve(TicketRoute);
  const transactionRoutes = container.resolve(TransactionRoute);
  const deviceRoutes = container.resolve(DeviceRoutes);
  const reportRoutes = container.resolve(ReportRoutes);

  TransactionTimeoutJob(transactionRoutes.service); // ✅ ยังใช้ได้เหมือนเดิม

  // ✅ use route
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
  router.use("/ticket", ticketRoutes.routing());
  router.use("/ticketdiscount", discountRoutes.routing());
  router.use("/device", deviceRoutes.routing());
  router.use("/report", reportRoutes.routing());

  return router;
};