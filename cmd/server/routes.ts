import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { RouteDate } from '../routes/routeDateRoute';
import { RouteTime } from '../routes/routeTimeRoutes';
import { Route } from '../routes/routeRoutes';
import { RouteLocation } from '../routes/routeLocationRoute';
import { Auth } from '../routes/routeAuthRoute';
import { RoutesTicket } from '../routes/routeTicketRoute';
import { Account } from '../routes/accountRoute';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  router.use('/route', Route(prisma));
  router.use('/routeDates', RouteDate(prisma));
  router.use('/routeTimes', RouteTime(prisma));
  router.use('/routeLocations', RouteLocation(prisma));

  router.use('/auth', Auth(prisma));
  router.use('/routeTicket', RoutesTicket(prisma));
  router.use('/account', Account(prisma));

  return router;
};