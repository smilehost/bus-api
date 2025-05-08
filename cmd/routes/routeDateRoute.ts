import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { RouteDateRepository } from '../../internal/repository/routeDateRepository';
import { RouteDateService } from '../../internal/service/routeDateService';
import { DateController } from '../../internal/controller/routeDateController';

export class RouteDateRoutes {
  private router: Router;
  
  public repo: RouteDateRepository;
  public service: RouteDateService;
  public controller: DateController;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    
    this.repo = new RouteDateRepository(prisma);
    this.service = new RouteDateService(this.repo);
    this.controller = new DateController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/all", this.controller.getAll.bind(this.controller));
    this.router.get('/', this.controller.getByPagination.bind(this.controller));
    this.router.get('/:route_date_id', this.controller.getById.bind(this.controller));
    this.router.post('/', this.controller.create.bind(this.controller));
    this.router.put('/:route_date_id', this.controller.update.bind(this.controller));
    this.router.delete('/:route_date_id', this.controller.delete.bind(this.controller));
  }

  public routing(): Router {
    return this.router;
  }
}

// For backward compatibility
export const RouteDate = (prisma: PrismaClient) => {
  const routeDateRoutes = new RouteDateRoutes(prisma);
  return routeDateRoutes.routing();
};
