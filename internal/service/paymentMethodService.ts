import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { PaymentMethodRepository } from "../repository/PaymentMethodRepository";

export class PaymentMethodService {
  constructor(
    private readonly transactionRepository:PaymentMethodRepository
  ) {}
 
}
