import { PrismaClient } from "@prisma/client";
import { Route } from "../../cmd/models";

export class RouteRepository {
  constructor(private readonly prisma: PrismaClient) {}
  
  async create(data: Route) {
    return this.prisma.route.create({
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
  }

}