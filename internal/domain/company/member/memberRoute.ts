import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { CompanyRepository } from "../company/companyRepository";
import { MemberController } from "./memberController";
import { MemberRepository } from "./memberRepository";
import { MemberService } from "./memberService";

export class MemberRoute {
  private readonly router: Router;

  public repo: MemberRepository;
  public service: MemberService;
  public controller: MemberController;

  constructor(prisma: PrismaClient, comRepo: CompanyRepository) {
    this.router = Router();

    this.repo = new MemberRepository(prisma);
    this.service = new MemberService(this.repo, comRepo);
    this.controller = new MemberController(this.service);
    this.setupRoutes();
  }

  private setupRoutes(): void {}

  public routing(): Router {
    return this.router;
  }
}
