import { Router } from "express";
import { container } from "tsyringe";
import { DeviceController } from "./deviceController";
import { DeviceService } from "./deviceService";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";
import { verifyDevice } from "../../../../cmd/middleware/deviceAuthMiddleware";

export class DeviceRoutes {
  private readonly router: Router;
  public controller: DeviceController;
  public service: DeviceService;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(DeviceController);
    this.service = container.resolve(DeviceService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get("/", this.controller.getByPagination.bind(this.controller));

    this.router.get(
      "/devicedata",
      authorizeRoles("1", "2", "3"),
      verifyDevice(this.service),
      this.controller.getDeviceLoginData.bind(this.controller)
    );

    this.router.post("/",authorizeRoles("1"), this.controller.create.bind(this.controller));
    this.router.get(
      "/:device_id",authorizeRoles("1","2","3"),
      this.controller.getById.bind(this.controller)
    );
    this.router.put(
      "/:device_id",authorizeRoles("1"),
      this.controller.update.bind(this.controller)
    );
    this.router.delete(
      "/:device_id",authorizeRoles("1"),
      this.controller.delete.bind(this.controller)
    );
    this.router.patch(
      "/:device_id/status",authorizeRoles("1"),
      this.controller.changeStatus.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}
