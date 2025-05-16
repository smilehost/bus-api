import { PrismaClient, route_ticket_price_type } from "@prisma/client";
import { AppError } from "../utils/appError";

export class TicketPriceTypeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getTicketPriceType(comId: number) {
    try {
      return await this.prisma.route_ticket_price_type.findMany({
        where: {
          route_ticket_price_type_com_id: comId,
        },
        orderBy: {
          route_ticket_price_type_id: "asc",
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async createPriceType(comId: number, data: route_ticket_price_type) {
    try {
      return await this.prisma.route_ticket_price_type.create({
        data: {
          route_ticket_price_type_name: data.route_ticket_price_type_name,
          route_ticket_price_type_com_id: comId,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async deletePriceType(comId: number, priceTypeId: number) {
    try {
      return await this.prisma.route_ticket_price_type.deleteMany({
        where: {
          route_ticket_price_type_id: priceTypeId,
          route_ticket_price_type_com_id: comId,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
