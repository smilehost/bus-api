import { PrismaClient, route_ticket_price_type } from "@prisma/client";
import { RouteTicketWithPrices } from "../../../../cmd/request";
import { AppError } from "../../../utils/appError";
import { autoInjectable } from "tsyringe";


@autoInjectable()
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

  async findTicketsByRouteId(routeId: number) {
    try {
      return await this.prisma.route_ticket.findMany({
        where: {
          route_ticket_route_id: routeId,
          route_ticket_status: 1,
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
      const whereClause: any = {
        route_ticket_price_ticket_id: ticketId,
      };
  
      if (startId) {
        whereClause.route_ticket_location_start = startId;
      }
  
      if (stopId) {
        whereClause.route_ticket_location_stop = stopId;
      }
  
      const results = await this.prisma.route_ticket_price.findMany({
        where: whereClause,
        include: {
          price_type: {
            select: {
              route_ticket_price_type_name: true,
            },
          },
        },
      });
  
      return results.map((item) => ({
        ...item,
        route_ticket_price_type_name:
          item.price_type?.route_ticket_price_type_name ?? null,
        price_type: undefined,
      }));
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
  

  async getPaginated(
    comId: number,
    skip: number,
    take: number,
    search: string,
    status: number | null
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
        ...(typeof status === "number" ? { route_ticket_status: status } : {}),
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
            route:{
              select:{
                route_name_th:true,
                route_name_en:true,
                route_status:true,
              }
            }
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

  async updateStatus(id: number, status: number) {
    try {
      return await this.prisma.route_ticket.update({
        where: { route_ticket_id: id },
        data: {
          route_ticket_status: status,
        },
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
      console.log(error)
      throw AppError.fromPrismaError(error);
    }
  }
}
