import { PrismaClient } from "@prisma/client";
import { RouteTicketWithPrices } from "../../cmd/request";
import { AppError } from "../utils/appError";

export class TicketRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getTicketPriceType(id: number) {
    try {
      return await this.prisma.route_ticket_price_type.findMany({
        where: {
          route_ticket_price_type_com_id: id,
        },
        orderBy: {
          route_ticket_price_type_id: "asc",
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: RouteTicketWithPrices) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const routeTicket = await tx.route_ticket.create({
          data: {
            route_ticket_name_th: data.route_ticket_name_th,
            route_ticket_name_en: data.route_ticket_name_en,
            route_ticket_color: data.route_ticket_color,
            route_ticket_status: data.route_ticket_status,
            route_ticket_route_id: data.route_ticket_route_id,
            route_ticket_amount: data.route_ticket_amount,
            route_ticket_type: data.route_ticket_type,
          },
        });

        const pricesToCreate = data.route_ticket_price.map(
          (priceItem) => ({
            route_ticket_price_ticket_id: routeTicket.route_ticket_id,
            route_ticket_price_type_id: priceItem.route_ticket_price_type_id,
            route_ticket_location_start: String(
              priceItem.route_ticket_location_start
            ),
            route_ticket_location_stop: String(
              priceItem.route_ticket_location_stop
            ),
            price: String(priceItem.price),
            route_ticket_price_route_id: parseInt(
              priceItem.route_ticket_price_route_id
            ),
          })
        );

        await tx.route_ticket_price.createMany({ data: pricesToCreate });

        return routeTicket;
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  // async getAll(comId: number) {
  //   try {
  //     return await this.prisma.route_ticket.findMany({
  //       where: {
  //         route_ticket_route: {
  //           route_com_id: comId,
  //         },
  //       },
  //       orderBy: {
  //         route_ticket_id: "desc",
  //       },
  //       include: {
  //         route_ticket_price: true,
  //       },
  //     });
  //   } catch (error) {
  //     throw AppError.fromPrismaError(error);
  //   }
  // }

  async getById(id: number) {
    try {
      return await this.prisma.route_ticket.findUnique({
        where: { route_ticket_id: id },
        include: {
          route_ticket_price: true,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: RouteTicketWithPrices) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1. อัปเดต ticket หลัก
        const updatedTicket = await tx.route_ticket.update({
          where: { route_ticket_id: id },
          data: {
            route_ticket_name_th: data.route_ticket_name_th,
            route_ticket_name_en: data.route_ticket_name_en,
            route_ticket_color: data.route_ticket_color,
            route_ticket_status: data.route_ticket_status,
            route_ticket_route_id: data.route_ticket_route_id,
            route_ticket_amount: data.route_ticket_amount,
            route_ticket_type: data.route_ticket_type,
          },
        });

        // 2. จัดการรายการราคาทั้งหมด
        for (const priceItem of data.route_ticket_price) {
          await tx.route_ticket_price.update({
            where: {
              route_ticket_price_id: parseInt(priceItem.route_ticket_price_id),
            },
            data: {
              route_ticket_price_ticket_id: id,
              route_ticket_price_type_id: priceItem.route_ticket_price_type_id,
              route_ticket_location_start: String(
                priceItem.route_ticket_location_start
              ),
              route_ticket_location_stop: String(
                priceItem.route_ticket_location_stop
              ),
              price: String(priceItem.price),
              route_ticket_price_route_id: parseInt(
                priceItem.route_ticket_price_route_id
              ),
            },
          });
        }

        console.log("---------2");

        return updatedTicket;
      });
    } catch (error) {
      console.log("Error in update:", error);
      
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // ลบราคาก่อน
        await tx.route_ticket_price.deleteMany({
          where: {
            route_ticket_price_ticket_id: id,
          },
        });

        // ลบตัว ticket
        return await tx.route_ticket.delete({
          where: { route_ticket_id: id },
        });
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
