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
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
};