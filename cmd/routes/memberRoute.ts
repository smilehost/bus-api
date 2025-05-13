import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { MemberRepository } from "../../internal/repository/memberRepository";
import { MemberService } from "../../internal/service/memberService";
import { MemberController } from "../../internal/controller/memberController";
import { CompanyRepository } from "../../internal/repository/companyRepository";

export class RouteMemberRoute {
  private readonly router: Router;

  public repo: MemberRepository;
  public service: MemberService;
  public controller: MemberController;

  constructor(prisma: PrismaClient,comRepo: CompanyRepository) {
    this.router = Router();

    this.repo = new MemberRepository(prisma);
    this.service = new MemberService(this.repo,comRepo);
    this.controller = new MemberController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {
  }

  public routing(): Router {
    return this.router;
  }
}
