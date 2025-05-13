import { RouteRepository } from "../repository/routeRepository";
import { RouteDateRepository } from "../repository/routeDateRepository";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteLocationRepository } from "../repository/routeLocationRepository";
import { route } from "@prisma/client";

export class RouteService {
  constructor(
    private readonly routeRepository: RouteRepository,
    private readonly routeDateRepository: RouteDateRepository,
    private readonly loactionRepository: RouteLocationRepository
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

  async create(comId: number, data: route) {
    if (!Util.ValidCompany(comId, data.route_com_id)) {
      throw AppError.Forbidden("Route: Company ID does not match");
    }

    const date = await this.routeDateRepository.getById(data.route_date_id);

    if (!date) {
      throw AppError.NotFound("Date not found");
    }

    return this.routeRepository.create(data);
  }

  async update(comId: number, routeId: number, data: route) {
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

    const start = String(startLocationId);
    const end = String(endLocationId);

    // 2. Filter เส้นทางที่มี start มาก่อน end ///
    const filteredRoutes = routes.filter((route) => {
      const routeArray = route.route_array.split(",");
      const startIndex = routeArray.indexOf(start);
      const endIndex = routeArray.indexOf(end);
      return startIndex !== -1 && endIndex !== -1 && startIndex < endIndex;
    });

    if (filteredRoutes.length === 0) {
      throw AppError.NotFound(
        "Route not found for the given locations and date"
      );
    }

    return filteredRoutes;
  }

  async getRoutesUsingLocation(comId: number, locationId: number) {
    const locationStr = locationId.toString();
    return await this.routeRepository.findRoutesByLocation(comId, locationStr);
  }

  async getStartEndLocation(route:route){
    const routeLocation = route.route_array.split(",")
    const start = Number(routeLocation[0])
    const stop = Number(routeLocation.pop())

    const startLocation = await this.loactionRepository.getById(start)
    const stopLocation = await this.loactionRepository.getById(stop)

    if (!startLocation || !stopLocation){
      throw AppError.NotFound("can't find start or stop location in Route")
    }

    return {
      startLocation:startLocation,
      stopLocation:stopLocation
    }
  }
}
