import { Route } from "../../cmd/models";
import { RouteRepository } from "../repository/routeRepository";
import { RouteDateRepository } from "../repository/routeDateRepository";
import { RouteTimeRepository } from "../repository/routeTimeRepository";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";

export class RouteService {
  constructor(
    private readonly routeRepository: RouteRepository,
    private readonly routeDateRepository: RouteDateRepository,
    private readonly routeTimeRepository: RouteTimeRepository
  ) {}

  async getByPagination(
    comId: number,
    page: number,
    size: number,
    search: string
  ) {
    search = search.toString();

    const skip = (page - 1) * size;
    const take = size;

    const [data, total] = await this.routeRepository.getPaginated(
      comId,
      skip,
      take,
      search
    );

    return {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      data,
    };
  }

  async getById(comId: number, routeId: number) {
    const route = await this.routeRepository.getById(routeId);

    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route: Company ID does not match");
    }

    return route;
  }

  async create(comId: number, data: Route) {
    console.log("--------------1");
    
    if (!Util.ValidCompany(comId, data.route_com_id)) {
      throw AppError.Forbidden("Route: Company ID does not match");
    }
    console.log("--------------2");
    console.log(data.route_date_id);
    
    const date = await this.routeDateRepository.getById(data.route_date_id);
    console.log("--------------3");
    console.log(date);
    
    
    if (!date) {
      console.log("--------------3.1");
      
      throw AppError.NotFound("Date not found");
    }
    console.log("--------------4");
    

    return this.routeRepository.create(data);
  }

  async update(comId: number, routeId: number, data: Route) {
    const existingRoute = await this.routeRepository.getById(routeId);
    if (!existingRoute) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, existingRoute.route_com_id)) {
      throw AppError.Forbidden("Route: Company ID does not match");
    }

    return this.routeRepository.update(routeId, data);
  }

  async delete(comId: number, routeId: number) {
    const existingRoute = await this.routeRepository.getById(routeId);
    if (!existingRoute) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, existingRoute.route_com_id)) {
      throw AppError.Forbidden("Route: Company ID does not match");
    }

    return this.routeRepository.delete(routeId);
  }

  async getRouteByLocations(
    comId: number,
    startLocationId: number,
    endLocationId: number,
    date: string
  ) {
    const dayOfWeek = new Date(date).getDay();

    // 1. ดึง routes ที่มี route_date_id ว่างในวันนั้น (ต้อง join route_date)
    const routes = await this.routeRepository.getRouteByDay(comId, dayOfWeek);
    console.log(routes);

    const start = String(startLocationId);
    const end = String(endLocationId);

    // 2. Filter เส้นทางที่มี start มาก่อน end
    const filteredRoutes = routes.filter((route) => {
      const routeArray = route.route_array.split(",");
      const startIndex = routeArray.indexOf(start);
      const endIndex = routeArray.indexOf(end);
      return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
    });

    // ต่อไปคือ check กับ ticket_remain เพื่อเช็คจำนวนตั๋ว

    // ถ้ายังเหลือจะดึงราคาออกมา จาก toute_ticket_price where route_id = route.route_id and route_ticket_location_start = start and route_ticket_location_stop = stop

    if (filteredRoutes.length === 0) {
      throw AppError.NotFound(
        "Route not found for the given locations and date"
      );
    }

    return filteredRoutes;
  }
}
