import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { RouteTime } from "../../cmd/models"; // หรือใช้ Prisma model ก็ได้

export class TimeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number) {
    try {
      return await this.prisma.route_time.findMany({
        where: {
          route_time_com_id: comId,
        },
        orderBy: {
          route_time_id: "desc",
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
  ): Promise<[RouteTime[], number]> {
    try {
      const where = {
        route_time_com_id: comId,
        ...(search.trim()
          ? {
              route_time_name: {
                contains: search.toLowerCase(),
              },
            }
          : {}),
      };

      const [data, total] = await this.prisma.$transaction([
        this.prisma.route_time.findMany({
          where,
          skip,
          take,
          orderBy: { route_time_id: "desc" },
        }),
        this.prisma.route_time.count({ where }),
      ]);

      return [data, total];
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(id: number) {
    try {
      return await this.prisma.route_time.findUnique({
        where: { route_time_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: RouteTime) {
    try {
      return await this.prisma.route_time.create({
        data: {
          route_time_name: data.route_time_name,
          route_time_array: data.route_time_array,
          route_time_com_id: data.route_time_com_id,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: Partial<RouteTime>) {
    try {
      return await this.prisma.route_time.update({
        where: { route_time_id: id },
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.route_time.delete({
        where: { route_time_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}