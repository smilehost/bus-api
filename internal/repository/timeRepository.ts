import { PrismaClient } from "@prisma/client";
import { RouteTime } from "../../cmd/models"; // หรือใช้ Prisma model ก็ได้

export class TimeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getPaginated(skip: number, take: number, search: string) {
    return this.prisma.$transaction([
      this.prisma.route_time.findMany({
        where: {
          route_time_name: {
            contains: search.toLowerCase(), // 👈 ทำให้ insensitive ด้วยตัวเอง
          },
        },
        skip,
        take,
        orderBy: {
          route_time_id: "desc",
        },
      }),
      this.prisma.route_time.count({
        where: {
          route_time_name: {
            contains: search.toLowerCase(),
          },
        },
      }),
    ]);
  }

  async getById(routeTimeId: number) {
    return this.prisma.route_time.findFirst({
      where: {
        route_time_id: routeTimeId,
      },
    });
  }

  async create(data: RouteTime) {
    return this.prisma.route_time.create({
      data: {
        route_time_name: data.route_time_name,
        route_time_array: data.route_time_array,
        route_time_com_id: data.route_time_com_id,
      },
    });
  }

  async update(id: number, data: Partial<RouteTime>) {
    return this.prisma.route_time.update({
      where: { route_time_id: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.route_time.delete({
      where: { route_time_id: id },
    });
  }
}
