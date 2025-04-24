import { PrismaClient } from "@prisma/client";
import { RouteDate } from "../../cmd/models";
import { AppError } from "../utils/appError";

export class DateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.route_date.findMany();
  }

  async getById(id: number) {
    return this.prisma.route_date.findUnique({
      where: { route_date_id: id },
    });
  }

  async create(data: RouteDate) {
    try {
      return this.prisma.route_date.create({ 
        data:{
          route_date_name:data.route_date_name,
          route_date_start:data.route_date_name,
          route_date_end:data.route_date_end,
          route_date_mon:data.route_date_mon,
          route_date_tue:data.route_date_tue,
          route_date_wen:data.route_date_wen,
          route_date_thu:data.route_date_thu,
          route_date_fri:data.route_date_fri,
          route_date_sat:data.route_date_sat,
          route_date_sun:data.route_date_sun,
          route_date_com_id:data.route_date_com_id
        }
       });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: Partial<RouteDate>) {
    return this.prisma.route_date.update({
      where: { route_date_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.route_date.delete({
      where: { route_date_id: id },
    });
  }
}