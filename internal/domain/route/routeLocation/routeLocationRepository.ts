import { PrismaClient, route_location } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class RouteLocationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number) {
    try {
      return await this.prisma.route_location.findMany({
        where: {
          route_location_com_id: comId,
        },
        orderBy: {
          route_location_id: "desc",
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
  ): Promise<[route_location[], number]> {
    try {
      const where = {
        route_location_com_id: comId,
        ...(search.trim()
          ? {
              route_location_name: {
                contains: search.toLowerCase(),
              },
            }
          : {}),
      };

      const [data, total] = await this.prisma.$transaction([
        this.prisma.route_location.findMany({
          skip,
          take,
          where,
          orderBy: { route_location_id: "desc" },
        }),
        this.prisma.route_location.count({ where }),
      ]);

      return [data, total];
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(id: number) {
    try {
      return await this.prisma.route_location.findUnique({
        where: { route_location_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: route_location) {
    try {
      return await this.prisma.route_location.create({
        data: {
          route_location_name: data.route_location_name,
          route_location_lat: data.route_location_lat,
          route_location_long: data.route_location_long,
          route_location_com_id: data.route_location_com_id,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: route_location) {
    try {
      return await this.prisma.route_location.update({
        where: { route_location_id: id },
        data: {
          route_location_name: data.route_location_name,
          route_location_lat: data.route_location_lat,
          route_location_long: data.route_location_long,
          route_location_com_id: data.route_location_com_id,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.route_location.delete({
        where: { route_location_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
