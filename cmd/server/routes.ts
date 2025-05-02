import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { RouteDate } from '../routes/routeDateRoutes';
import { RouteTime } from '../routes/routeTimeRoutes';
import { Route } from '../routes/routeRoutes';
import { RouteLocation } from '../routes/routeLocationRoutes';
import { Auth } from '../routes/routeAuth';
import { RoutesTicket } from '../routes/routeTicket';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  router.use('/route', Route(prisma));
  router.use('/routeDates', RouteDate(prisma));
  router.use('/routeTimes', RouteTime(prisma));
  router.use('/routeLocations', RouteLocation(prisma));

  router.use('/auth', Auth(prisma));
  router.use('/routeTicket', RoutesTicket(prisma));

  return router;
};