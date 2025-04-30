import { PrismaClient } from "@prisma/client";

export class TicketRepository {
  constructor(private readonly prisma: PrismaClient) {}
}
