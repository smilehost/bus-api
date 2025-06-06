import { PrismaClient, route_ticket_price_type } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { autoInjectable } from "tsyringe";


@autoInjectable()
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

  async getTicketPriceTypeById(ticketPriceTypeId: number) {
    try {
      return await this.prisma.route_ticket_price_type.findUnique({
        where: {
          route_ticket_price_type_id:ticketPriceTypeId,
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

  async editPriceType( priceTypeId: number,priceTypename:string) {
    try {
      return await this.prisma.route_ticket_price_type.update({
        where: {
          route_ticket_price_type_id: priceTypeId,
        },
        data:{
          route_ticket_price_type_name:priceTypename
        }
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async deletePriceType( priceTypeId: number) {
    try {
      return await this.prisma.route_ticket_price_type.delete({
        where: {
          route_ticket_price_type_id: priceTypeId,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async isPriceTypeUsage(priceTypeId:number){
    try {
      const found = await this.prisma.route_ticket_price.findFirst({
        where:{
          route_ticket_price_type_id:priceTypeId
        }
      });
      return found === null 

    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
