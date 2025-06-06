import { PrismaClient, route_date } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { autoInjectable } from "tsyringe";


@autoInjectable()
export class RouteDateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number) {
    try {
      return await this.prisma.route_date.findMany({
        where: {
          route_date_com_id: comId,
        },
        orderBy: {
          route_date_id: "desc",
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
    search: string
  ): Promise<[route_date[], number]> {
    try {
      const where = {
        route_date_com_id: comId,
        ...(search.trim()
          ? {
              route_date_name: { contains: search.toLowerCase() },
            }
          : {}),
      };

      const [data, total] = await this.prisma.$transaction([
        this.prisma.route_date.findMany({
          skip,
          take,
          where,
          orderBy: { route_date_id: "desc" },
        }),
        this.prisma.route_date.count({ where }),
      ]);

      return [data, total];
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(id: number) {
    try {
      return await this.prisma.route_date.findUnique({
        where: { route_date_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: route_date) {
    try {
      return await this.prisma.route_date.create({
        data: {
          route_date_name: data.route_date_name,
          route_date_start: data.route_date_start,
          route_date_end: data.route_date_end,
          route_date_mon: data.route_date_mon,
          route_date_tue: data.route_date_tue,
          route_date_wen: data.route_date_wen,
          route_date_thu: data.route_date_thu,
          route_date_fri: data.route_date_fri,
          route_date_sat: data.route_date_sat,
          route_date_sun: data.route_date_sun,
          route_date_com_id: data.route_date_com_id,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: Partial<route_date>) {
    try {
      return await this.prisma.route_date.update({
        where: { route_date_id: id },
        data: {
          route_date_name: data.route_date_name,
          route_date_start: data.route_date_start,
          route_date_end: data.route_date_end,
          route_date_mon: data.route_date_mon,
          route_date_tue: data.route_date_tue,
          route_date_wen: data.route_date_wen,
          route_date_thu: data.route_date_thu,
          route_date_fri: data.route_date_fri,
          route_date_sat: data.route_date_sat,
          route_date_sun: data.route_date_sun,
          route_date_com_id: data.route_date_com_id,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.route_date.delete({
        where: { route_date_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
