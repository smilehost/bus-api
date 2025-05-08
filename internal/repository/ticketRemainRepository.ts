import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";

export class TicketRemainRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getById(ticket_remain_id: string) {
    try {
      return await this.prisma.ticket_remain.findUnique({
        where: { ticket_remain_id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getRemainNumber(
    date: string,
    time: string,
    route_ticket_id: number
  ): Promise<number> {
    try {
      const remain = await this.prisma.ticket_remain.findFirst({
        where: {
          ticket_remain_date: date,
          ticket_remain_time: time,
          ticket_remain_route_id: route_ticket_id,
        },
      });

      if (!remain) {
        throw AppError.NotFound("Ticket remain not found");
      }

      return remain.ticket_remain_number;
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

}
