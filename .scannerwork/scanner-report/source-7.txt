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

  router.get("/all", controller.getAll.bind(controller));
  router.get('/', controller.getByPagination.bind(controller));
  router.get('/:route_date_id', controller.getById.bind(controller));
  router.post('/', controller.create.bind(controller));
  router.put('/:route_date_id', controller.update.bind(controller));
  router.delete('/:route_date_id', controller.delete.bind(controller));

  return router;
};