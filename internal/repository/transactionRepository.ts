// path: internal/repository/transactionRepository.ts
import { member, PrismaClient, ticket } from "@prisma/client";
import { AppError } from "../utils/appError";
import {CreateTransactionDto } from "../../cmd/dto";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async makeTransaction(
    transaction: CreateTransactionDto,
    member: member | null
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        if (member) {
          const { member_id, ...memberData } = member;
          const createdMember = await tx.member.create({
            data: memberData,
          });
          transaction.transaction_member_id = createdMember.member_id;
        }

        const createdTransaction = await tx.transaction.create({
          data: transaction,
        });

        return createdTransaction
      });
    } catch (error) {
      console.log(error);
      throw AppError.fromPrismaError(error);
    }
  }

  async getTransactionPositions(com_id:number){
    try {
      return await this.prisma.transaction.findMany({
        where: {
          transaction_com_id:com_id,
        },
        select:{
          transaction_lat:true,
          transaction_long:true,
          transaction_route_id:true,
          transaction_amount:true,
          transaction_payment_method_id:true,
        }
      });
    } catch (error) {
      
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(transaction_id: number) {
    try {
      return await this.prisma.transaction.findUnique({
        where: {
          transaction_id: transaction_id,
        },
      });
    } catch (error) {
      console.log("1qrewrrewrerewrewrwfsdgfdgfdgfdgfdgdger");
      
      throw AppError.fromPrismaError(error);
    }
  }

  async changeStatusById(transaction_id: number, status: string) {
    try {
      return await this.prisma.transaction.update({
        where: {
          transaction_id: transaction_id,
        },
        data: {
          transaction_status: status,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getRouteTicketById(routeTicketId: number) {
    try {
      return await this.prisma.route_ticket.findUnique({
        where: {
          route_ticket_id: routeTicketId,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
