import { Route } from "../../cmd/models";
import { RouteRepository } from "../repository/routeRepository";
import { DateRepository } from "../repository/dateRepository";
import { TimeRepository } from "../repository/timeRepository";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";

export class RouteService {
  constructor(
    private readonly routeRepository: RouteRepository,
    private readonly dateRepository: DateRepository,
    private readonly timeRepository: TimeRepository
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
    if (!Util.ValidCompany(comId, data.route_com_id)) {
      throw AppError.Forbidden("Route: Company ID does not match");
    }

    const date = await this.dateRepository.getById(data.route_date_id);
    if (!date) {
      throw AppError.NotFound("Date not found");
    }

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
}
