import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { DeviceRepository } from "./deviceRepository";
import { DeviceService } from "./deviceService";
import { DeviceController } from "./deviceController";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";
import { verifyDevice } from "../../../../cmd/middleware/deviceAuthMiddleware";

export class DeviceRoutes {
  private readonly router: Router;

  public repo: DeviceRepository;
  public service: DeviceService;
  public controller: DeviceController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new DeviceRepository(prisma);
    this.service = new DeviceService(this.repo);
    this.controller = new DeviceController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/", this.controller.getByPagination.bind(this.controller)); 
    this.router.get("/devicedata",
      authorizeRoles("1","2","3"),verifyDevice(this.service),
      this.controller.getDeviceLoginData.bind(this.controller)); 
      
    this.router.post("/", this.controller.create.bind(this.controller)); 
    this.router.get("/:device_id", this.controller.getById.bind(this.controller)); 
    this.router.put("/:device_id", this.controller.update.bind(this.controller)); 
    this.router.delete("/:device_id", this.controller.delete.bind(this.controller)); 
    this.router.patch("/:device_id/status", this.controller.changeStatus.bind(this.controller)); 
  }

  public routing(): Router {
    return this.router;
  }
}
