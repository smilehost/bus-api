// path: internal/repository/ticketRepository.ts
import { PrismaClient, ticket } from "@prisma/client";
import { AppError } from "../utils/appError";

export class TicketRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createMany(tickets: Omit<ticket, 'ticket_id'>[]): Promise<ticket[]> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const createdTickets: ticket[] = [];
        for (const ticketData of tickets) {
          const newTicket = await tx.ticket.create({ data: ticketData });
          createdTickets.push(newTicket);
        }
        return createdTickets;
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async createTicket(ticket:Omit<ticket,"ticket_id">){
    try {
      return await this.prisma.ticket.create({
        data:ticket
      })
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async findByUUID(ticket_uuid: string){
    try {
      return await this.prisma.ticket.findFirst({
        where: { ticket_uuid:ticket_uuid },
        orderBy:{
          ticket_id:"desc"
        },
        include:{
          route_ticket:true
        }
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async findById(ticket_id: number): Promise<ticket | null> {
    try {
      return await this.prisma.ticket.findUnique({
        where: { ticket_id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async findAll(
    comId: number,
    page: number,
    size: number,
    search: string,
    status?: string,
  ): Promise<{ tickets: ticket[]; total: number }> {
    const trimmedSearch = search.trim().toUpperCase();
  
    const whereCondition: any = {
      transaction: {
        transaction_com_id: comId,
      },
      ...(trimmedSearch
        ? {
            OR: [
              { ticket_uuid: { contains: trimmedSearch } },
            ],
          }
        : {}),
    };
    
  
    console.log(whereCondition)
    if (!(status==="")) {
      whereCondition.ticket_status = status;
    }
  
    try {
      const tickets = await this.prisma.ticket.findMany({
        where: whereCondition,
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          ticket_id: "desc",
        },
      });
  
      const total = await this.prisma.ticket.count({
        where: whereCondition,
      });
  
      return { tickets, total };
    } catch (error) {
      console.log(error)
      throw AppError.fromPrismaError(error);
    }
  }
  

  async findByTransactionId(transaction_id: number): Promise<ticket[]> {
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

  async getLastByPrefix(prefix: string): Promise<ticket | null> {
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
}
