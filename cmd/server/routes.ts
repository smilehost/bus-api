import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { DateRoutes } from '../routes/dateRoutes';
import { TimeRoutes } from '../routes/timeRoutes';
import { Route } from '../routes/route';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  router.use('/dates', DateRoutes(prisma));
  router.use('/times', TimeRoutes(prisma));
  router.use('/route', Route(prisma));

  return router;
};