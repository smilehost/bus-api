// internal/modules/date/routes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { DateRoutes } from '../routes/dateRoutes';

export const Routes = (prisma: PrismaClient) => {
  const router = Router();
  router.use('/dates', DateRoutes(prisma));

  return router;
};