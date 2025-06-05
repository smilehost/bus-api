import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "./authService";
import { AuthRepository } from "./authRespository";
import { authorizeRoles } from "../../../../cmd/middleware/authMiddleware";
import { AuthController } from "./authController";


export class AuthRoutes {
  private readonly router: Router;

  public repo: AuthRepository;
  public service: AuthService;
  public controller: AuthController;

  constructor(prisma: PrismaClient) {
    this.router = Router();

    this.repo = new AuthRepository(prisma);
    this.service = new AuthService(this.repo);
    this.controller = new AuthController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post("/login", this.controller.login.bind(this.controller));
    this.router.post("/logout", this.controller.logout.bind(this.controller));
    this.router.post(
      "/register",authorizeRoles("1","2"),
      this.controller.register.bind(this.controller)
    );
    this.router.post(
      "/changepassword",authorizeRoles("1","2","3"),
      this.controller.changePassword.bind(this.controller)
    );
    this.router.post(
      "/changeStatus",
      authorizeRoles("1","2"),
      this.controller.changeStatus.bind(this.controller)
    );
  }

  public routing(): Router {
    return this.router;
  }
}

export const Auth = (prisma: PrismaClient) => {
  const authRoutes = new AuthRoutes(prisma);
  return authRoutes.routing();
};
