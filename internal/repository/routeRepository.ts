import { PrismaClient } from "@prisma/client";
import { Route } from "../../cmd/models";
import { AppError } from "../utils/appError";

export class RouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
          date_id: data.date_id,
          time_id: data.time_id,
          route_array: data.route_array,
        },
      });
    } catch (error) {
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
          date_id: data.date_id,
          time_id: data.time_id,
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
