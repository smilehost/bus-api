import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { RouteDateRoutes } from '../routes/routeDateRoutes';
import { RouteTimeRoutes } from '../routes/routeTimeRoutes';
import { RouteRoutes } from '../routes/routeRoutes';
import { RouteLocationRoutes } from '../routes/routeLocationRoutes';
import { AuthRoutes } from '../routes/routeAuth';
import { RouteTicketRoutes } from '../routes/routeTicket';
import { CompanyRepository } from '../../internal/repository/companyRepository';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  
  // Create instances of all route classes
  const comRepo = new CompanyRepository(prisma)

  const routeDateRoutes = new RouteDateRoutes(prisma);
  const routeTimeRoutes = new RouteTimeRoutes(prisma,comRepo);
  const routeRoutes = new RouteRoutes(prisma,routeDateRoutes.repo,routeTimeRoutes.repo);
  const routeLocationRoutes = new RouteLocationRoutes(prisma,comRepo);
  const authRoutes = new AuthRoutes(prisma);
  const routeTicketRoutes = new RouteTicketRoutes(prisma, routeRoutes);
  
  // Use the routing method of each class
  router.use('/route', routeRoutes.routing());
  router.use('/routeDates', routeDateRoutes.routing());
  router.use('/routeTimes', routeTimeRoutes.routing());
  router.use('/routeLocations', routeLocationRoutes.routing());
  router.use('/auth', authRoutes.routing());
  router.use('/routeTicket', routeTicketRoutes.routing());

  return router;
};
