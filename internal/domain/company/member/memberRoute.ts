import { Router } from "express";
import { container } from "tsyringe";
import { MemberController } from "./memberController";

export class MemberRoute {
  private readonly router: Router;
  public controller: MemberController;

  constructor() {
    this.router = Router();

    this.controller = container.resolve(MemberController);
    this.setupRoutes();
  }

  private setupRoutes(): void {}

  public routing(): Router {
    return this.router;
  }
}
