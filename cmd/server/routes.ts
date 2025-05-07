import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { RouteDate } from '../routes/routeDateRoutes';
import { RouteTime } from '../routes/routeTimeRoutes';
import { RouteRoutes } from '../routes/routeRoutes';
import { RouteLocation } from '../routes/routeLocationRoutes';
import { Auth } from '../routes/routeAuth';
import { RouteTicketRoutes } from '../routes/routeTicket';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  
  const routeRoutes = new RouteRoutes(prisma);
  const routeTicketRoutes = new RouteTicketRoutes(prisma, routeRoutes);
  
  router.use('/route', routeRoutes.routing());
  router.use('/routeDates', RouteDate(prisma));
  router.use('/routeTimes', RouteTime(prisma));
  router.use('/routeLocations', RouteLocation(prisma));

  router.use('/auth', Auth(prisma));
  router.use('/routeTicket', routeTicketRoutes.routing());

  return router;
};
