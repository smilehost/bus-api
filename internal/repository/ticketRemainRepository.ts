import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";

export class TicketRemainRepository {
  constructor(private readonly prisma: PrismaClient) {}

}
