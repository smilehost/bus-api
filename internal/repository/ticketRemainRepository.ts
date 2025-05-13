import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { TicketRemain } from "../../cmd/models";

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
          ticket_remain_route_ticket_id: route_ticket_id,
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

  async findRemainByDate(ticket_id: number, date: string) {
    try {
      return await this.prisma.ticket_remain.findMany({
        where: {
          ticket_remain_route_ticket_id: ticket_id,
          ticket_remain_date: date,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async increaseRemainNumber(remainId: string, amount: number) {
    try {
      return await this.prisma.ticket_remain.update({
        where: { ticket_remain_id: remainId },
        data: {
          ticket_remain_number: {
            increment: amount,
          },
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async decreaseRemainNumber(remainId: string, amount: number) {
    try {
      return await this.prisma.ticket_remain.update({
        where: { ticket_remain_id: remainId },
        data: {
          ticket_remain_number: {
            decrement: amount,
          },
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async createRemain(data: TicketRemain) {
    try {
      return await this.prisma.ticket_remain.create({
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
