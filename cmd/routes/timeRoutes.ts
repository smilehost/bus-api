import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { TimeRepository } from '../../internal/repository/timeRepository';
import { TimeService } from '../../internal/service/timeService';
import { TimeController } from '../../internal/controller/timeController';

export const TimeRoutes = (prisma: PrismaClient) => {
  const router = Router();

  const repo = new TimeRepository(prisma);
  const service = new TimeService(repo);
  const controller = new TimeController(service);

    // router.get('/', controller.getAll);
    // router.get('/:id', controller.getById);
    router.post('/', controller.create);
    // router.put('/:id', controller.update);
    // router.delete('/:id', controller.delete);


  return router;
};