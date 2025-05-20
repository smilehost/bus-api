import { PrismaClient, route } from "@prisma/client";
import { AppError } from "../utils/appError";

export class RouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number): Promise<route[]> {
    try {
      return await this.prisma.route.findMany({
        where: { route_com_id: comId },
        orderBy: { route_id: "desc" },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getRouteByDay(comId: number, dayOfWeek: number) {
    const dayColumnMap = [
      "route_date_sun",
      "route_date_mon",
      "route_date_tue",
      "route_date_wen", // ✅ ตามที่ schema ระบุไว้
      "route_date_thu",
      "route_date_fri",
      "route_date_sat",
    ];
    const dayColumn = dayColumnMap[dayOfWeek];

    return this.prisma.route.findMany({
      where: {
        route_com_id: comId,
        route_status: 1,
        route_date: {
          [dayColumn]: 1,
        },
      },
      include: {
        route_date: true,
        route_time: true,
      },
    });
  }

  async getPaginated(
    comId: number,
    skip: number,
    take: number,
    search: string,
    status: number | null
  ): Promise<[any[], number]> {
    try {
      const where = {
        route_com_id: comId,
        ...(search.trim()
          ? {
              OR: [
                { route_name_th: { contains: search.toLowerCase() } },
                { route_name_en: { contains: search.toLowerCase() } },
              ],
            }
          : {}),
        ...(typeof status === "number" ? { route_status: status } : {}),
      };

      // First get the routes
      const [routes, total] = await this.prisma.$transaction([
        this.prisma.route.findMany({
          skip,
          take,
          where,
          orderBy: { route_id: "desc" },
        }),
        this.prisma.route.count({ where }),
      ]);

      // Get the route IDs
      const routeIds = routes.map((route) => route.route_id);

      // Get the count of tickets for each route
      const ticketCounts = await this.prisma.route_ticket.groupBy({
        by: ["route_ticket_route_id"],
        where: {
          route_ticket_route_id: {
            in: routeIds,
          },
        },
        _count: {
          route_ticket_id: true,
        },
      });

      // Create a map of route ID to ticket count
      const ticketCountMap = new Map<number, number>();
      ticketCounts.forEach((count) => {
        ticketCountMap.set(
          count.route_ticket_route_id,
          count._count.route_ticket_id
        );
      });

      // Add the ticket count to each route
      const routesWithTicketCount = routes.map((route) => ({
        ...route,
        route_ticket_count: ticketCountMap.get(route.route_id) || 0,
      }));

      return [routesWithTicketCount, total];
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(routeId: number) {
    try {
      return await this.prisma.route.findUnique({
        where: { route_id: routeId },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: route) {
    try {
      return await this.prisma.route.create({
        data: {
          route_name_th: data.route_name_th,
          route_name_en: data.route_name_en,
          route_color: data.route_color,
          route_status: data.route_status,
          route_com_id: data.route_com_id,
          route_date_id: data.route_date_id,
          route_time_id: data.route_time_id,
          route_array: data.route_array,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(routeId: number, data: route) {
    try {
      return await this.prisma.route.update({
        where: { route_id: routeId },
        data: {
          route_name_th: data.route_name_th,
          route_name_en: data.route_name_en,
          route_color: data.route_color,
          route_status: data.route_status,
          route_com_id: data.route_com_id,
          route_date_id: data.route_date_id,
          route_time_id: data.route_time_id,
          route_array: data.route_array,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(routeId: number) {
    try {
      return await this.prisma.route.delete({
        where: { route_id: routeId },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async findRoutesByLocation(comId: number, locationId: string) {
    try {
      return await this.prisma.route.findMany({
        where: {
          route_com_id: comId,
          OR: [
            { route_array: { equals: locationId } },
            { route_array: { startsWith: `${locationId},` } },
            { route_array: { endsWith: `,${locationId}` } },
            { route_array: { contains: `,${locationId},` } },
          ],
        },
        select: {
          route_id: true,
          route_name_th: true,
          route_array: true,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
