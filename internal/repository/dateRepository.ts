import { PrismaClient } from "@prisma/client";
import { RouteDate } from "../../cmd/models";

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
    return this.prisma.route_date.create({ data });
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