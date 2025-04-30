import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { RouteDateRepository } from '../../internal/repository/routeDateRepository';
import { RouteDateService } from '../../internal/service/routeDateService';
import { DateController } from '../../internal/controller/routeDateController';

export const DateRoutes = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new RouteDateRepository(prisma);
  const service = new RouteDateService(repo);
  const controller = new DateController(service);

  router.get("/all", controller.getAll.bind(controller));
  router.get('/', controller.getByPagination.bind(controller));
  router.get('/:route_date_id', controller.getById.bind(controller));
  router.post('/', controller.create.bind(controller));
  router.put('/:route_date_id', controller.update.bind(controller));
  router.delete('/:route_date_id', controller.delete.bind(controller));

  return router;
};