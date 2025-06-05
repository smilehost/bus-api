import { PrismaClient, route_time } from "@prisma/client";
import { AppError } from "../../../utils/appError";

export class RouteTimeRepository {
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
  ): Promise<[route_time[], number]> {
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

  async create(data: Omit<route_time, "route_time_id">) {
    try {
      return await this.prisma.route_time.create({ data });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: Partial<route_time>) {
    try {
      return await this.prisma.route_time.update({
        where: { route_time_id: id },
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
