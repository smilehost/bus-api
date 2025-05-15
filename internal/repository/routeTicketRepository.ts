import { PrismaClient, route_ticket_price_type } from "@prisma/client";
import { RouteTicketWithPrices } from "../../cmd/request";
import { AppError } from "../utils/appError";

export class RouteTicketRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getTicketPrices(route_ticket_id: number) {
    try {
      return await this.prisma.route_ticket_price.findMany({
        where: {
          route_ticket_price_ticket_id: route_ticket_id,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getAllTicketsByRouteId(routeId: number) {
    try {
      return await this.prisma.route_ticket.findMany({
        where: {
          route_ticket_route_id: routeId,
        },
        orderBy: {
          route_ticket_id: "desc",
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getTicketPricingByLocation(
    ticketId: number,
    startId?: string,
    stopId?: string
  ) {
    try {
      const query: any = {
        route_ticket_price_ticket_id: ticketId,
      };

      if (startId) {
        query.route_ticket_location_start = startId;
      }

      if (stopId) {
        query.route_ticket_location_stop = stopId;
      }

      return await this.prisma.route_ticket_price.findMany({
        where: query,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

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

  async getPaginated(
    comId: number,
    skip: number,
    take: number,
    search: string,
    status: number|null,
  ): Promise<[any[], number]> {
    try {
      const relatedRouteIds = (
        await this.prisma.route.findMany({
          where: { route_com_id: comId },
          select: { route_id: true },
        })
      ).map((r) => r.route_id);

      const where: any = {
        route_ticket_route_id: {
          in: relatedRouteIds,
        },
        ...(search.trim()
          ? {
              OR: [
                { route_ticket_name_th: { contains: search } },
                { route_ticket_name_en: { contains: search } },
              ],
            }
          : {}),
          ...(status !== null && status !== undefined
            ? { route_ticket_status: status }
          : {}),
      };
  

      const [data, total] = await this.prisma.$transaction([
        this.prisma.route_ticket.findMany({
          where,
          skip,
          take,
          orderBy: { route_ticket_id: "desc" },
          select: {
            route_ticket_id: true,
            route_ticket_name_th: true,
            route_ticket_name_en: true,
            route_ticket_color: true,
            route_ticket_status: true,
            route_ticket_route_id: true,
            route_ticket_amount: true,
            route_ticket_type: true,
          },
        }),
        this.prisma.route_ticket.count({ where }),
      ]);

      return [data, total];
    } catch (error) {
      console.error("Error in getPaginated:", error);
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

        const pricesToCreate = data.route_ticket_price.map((priceItem) => ({
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
        }));

        await tx.route_ticket_price.createMany({ data: pricesToCreate });

        return routeTicket;
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(id: number) {
    try {
      return await this.prisma.route_ticket.findUnique({
        where: { route_ticket_id: id },
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

        // 2. วนลูปรายการราคาทั้งหมด
        for (const priceItem of data.route_ticket_price) {
          const isNew = !priceItem.route_ticket_price_id;

          if (isNew) {
            // ✅ CREATE ใหม่
            await tx.route_ticket_price.create({
              data: {
                route_ticket_price_ticket_id: id,
                route_ticket_price_type_id:
                  priceItem.route_ticket_price_type_id,
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
          } else {
            // ✅ UPDATE
            await tx.route_ticket_price.update({
              where: {
                route_ticket_price_id: parseInt(
                  priceItem.route_ticket_price_id ?? "0"
                ),
              },
              data: {
                route_ticket_price_ticket_id: id,
                route_ticket_price_type_id:
                  priceItem.route_ticket_price_type_id,
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
        }

        return updatedTicket;
      });
    } catch (error) {
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
