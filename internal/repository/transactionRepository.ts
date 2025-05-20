// path: internal/repository/transactionRepository.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { CreateTicketDto, CreateTransactionDto } from "../../cmd/dto";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async makeTransaction(
    transaction: CreateTransactionDto,
    tickets:CreateTicketDto[]
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const createdTransaction = await tx.transaction.create({
          data:transaction
        })
        const createdTickets = await tx.ticket.createMany({
          data: tickets.map(ticket => ({
            ...ticket,
            ticket_transaction_id: createdTransaction.transaction_id
          }))
        })

        return {
          ...createdTransaction,
          tickets:createdTickets
        }
      });
    } catch (error) {
      console.log(error)
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
  }

  async getRouteTicketById(routeTicketId:number){
    try {
      return await this.prisma.route_ticket.findUnique({
        where:{
          route_ticket_id:routeTicketId
        }
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
