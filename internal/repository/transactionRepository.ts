// path: internal/repository/transactionRepository.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { CreateTransactionDto } from "../../cmd/dto";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createAllInOneTransaction(
    com_id: number,
    payload: CreateTransactionDto
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. สร้าง member ใหม่เสมอ

        // 2. สร้าง transaction

        // 3. เตรียม tickets
      
        // 4. สร้าง tickets

        return 1 as any
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getLastTicket(prefix:string){
    try {
      return await this.prisma.ticket.findFirst({
        where: {
          ticket_uuid: {
            startsWith: prefix,
          },
        },
        orderBy: {
          ticket_uuid: 'desc',
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
}}
