import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { MemberRepository } from "../../internal/repository/memberRepository";
import { MemberService } from "../../internal/service/memberService";
import { MemberController } from "../../internal/controller/memberController";

export class MemberRoute {
  private readonly router: Router;

  public repo: MemberRepository;
  public service: MemberService;
  public controller: MemberController;

  constructor(
    prisma: PrismaClient
  ) {
    this.router = Router();

    this.repo = new MemberRepository(prisma);
    this.service = new MemberService(this.repo);
    this.controller = new MemberController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // this.router.get("/all", this.controller.getAll.bind(this.controller));
    // this.router.get("/", this.controller.getByPagination.bind(this.controller));
    // this.router.get(
    //   "/:route_location_id",
    //   this.controller.getById.bind(this.controller)
    // );
    // this.router.post("/", this.controller.create.bind(this.controller));
    // this.router.put(
    //   "/:route_location_id",
    //   this.controller.update.bind(this.controller)
    // );
    // this.router.delete(
    //   "/:route_location_id",
    //   this.controller.delete.bind(this.controller)
    // );
  }

  public routing(): Router {
    return this.router;
  }
}
