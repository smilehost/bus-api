import { PrismaClient } from "@prisma/client";

export class MemberRepository {
  constructor(private readonly prisma: PrismaClient) {}
}
