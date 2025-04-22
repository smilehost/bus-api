import { PrismaClient } from '@prisma/client';
import { RouteTime } from '../../cmd/models'; // หรือใช้ Prisma model ก็ได้

export class TimeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: RouteTime) {
    return this.prisma.route_time.create({
      data: {
        route_time_name: data.route_time_name,
        route_time_array: data.route_time_array,
        route_time_com_id: data.route_time_com_id,
      },
    });
  }


}