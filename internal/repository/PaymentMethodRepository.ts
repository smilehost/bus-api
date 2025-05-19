import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";

export class PaymentMethodRepository {
  constructor(private readonly prisma: PrismaClient) {}
}
