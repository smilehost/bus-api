// internal/modules/date/routes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { DateRepository } from '../../internal/repository/dateRepository';
import { DateService } from '../../internal/service/dateService';
import { DateController } from '../../internal/controller/dateController';

export const DateRoutes = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new DateRepository(prisma);
  const service = new DateService(repo);
  const controller = new DateController(service);

  router.get('/', controller.getAll);

  return router;
};