import { PrismaClient } from "@prisma/client";
import { Route } from "../../cmd/models";
import { AppError } from "../utils/appError";

export class RouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number): Promise<Route[]> {
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
    search: string
  ): Promise<[Route[], number]> {
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
      };

      const [data, total] = await this.prisma.$transaction([
        this.prisma.route.findMany({
          skip,
          take,
          where,
          orderBy: { route_id: "desc" },
        }),
        this.prisma.route.count({ where }),
      ]);

      return [data, total];
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

  async create(data: Route) {
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
      console.log(error);
      
      throw AppError.fromPrismaError(error);
    }
  }

  async update(routeId: number, data: Route) {
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
}
