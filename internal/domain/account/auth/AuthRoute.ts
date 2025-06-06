import { Router } from "express";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";
import { AuthController } from "./authController";
import { container } from "tsyringe";

export class AuthRoutes {
  private readonly router: Router;
  public controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = container.resolve(AuthController);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post("/login", this.controller.login.bind(this.controller));
    this.router.post("/logout", this.controller.logout.bind(this.controller));
    this.router.post(
      "/register",
      authorizeRoles("1", "2"),
      this.controller.register.bind(this.controller)
    );
    this.router.post(
      "/changepassword",
      authorizeRoles("1", "2", "3"),
      this.controller.changePassword.bind(this.controller)
    );
    this.router.post(
      "/changeStatus",
      authorizeRoles("1", "2"),
      this.controller.changeStatus.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}