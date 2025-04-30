import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { DateRoutes } from '../routes/routeDateRoutes';
import { TimeRoutes } from '../routes/routeTimeRoutes';
import { Route } from '../routes/routeRoutes';
import { LocationRoute } from '../routes/routeLocationRoutes';
import { Auth } from '../routes/routeAuth';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  router.use('/dates', DateRoutes(prisma));
  router.use('/times', TimeRoutes(prisma));
  router.use('/locations', LocationRoute(prisma));
  router.use('/route', Route(prisma));
  router.use('/auth', Auth(prisma));

  return router;
};