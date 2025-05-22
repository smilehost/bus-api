// path: internal/repository/transactionRepository.ts
import { member, PrismaClient, ticket } from "@prisma/client";
import { AppError } from "../utils/appError";
import { CreateTicketDto, CreateTransactionDto } from "../../cmd/dto";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async makeTransaction(
    transaction: CreateTransactionDto,
    member: member | null
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        if (member) {
          const createdMember = await tx.member.create({
            data: member,
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
  
  async createTikcets(tickets:ticket[]){
    try {
      return await this.prisma.ticket.createMany({
        data:tickets
      })
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
      throw AppError.fromPrismaError(error);
    }
  }

  async getTicketByTransactionId(transaction_id: number) {
    try {
      return await this.prisma.ticket.findMany({
        where: {
          ticket_transaction_id: transaction_id,
        },
      });
    } catch (error) {
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

  async getLastTicket(prefix: string) {
    try {
      return await this.prisma.ticket.findFirst({
        where: {
          ticket_uuid: {
            startsWith: prefix,
          },
        },
        orderBy: {
          ticket_uuid: "desc",
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
