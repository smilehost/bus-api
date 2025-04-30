import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { RouteDate } from '../routes/routeDateRoutes';
import { RouteTime } from '../routes/routeTimeRoutes';
import { Route } from '../routes/routeRoutes';
import { RouteLocation } from '../routes/routeLocationRoutes';
import { Auth } from '../routes/routeAuth';
import { Ticket } from '../routes/TicketRoutes';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  router.use('/route', Route(prisma));
  router.use('/dates', RouteDate(prisma));
  router.use('/times', RouteTime(prisma));
  router.use('/locations', RouteLocation(prisma));

  router.use('/ticket', Ticket(prisma));
  router.use('/auth', Auth(prisma));

  return router;
};