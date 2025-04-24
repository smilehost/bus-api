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

  async getByPagination(page: number, size: number, search: string) {
    const skip = (page - 1) * size;
    const take = size;

    const [data, total] = await this.routeRepository.getPaginated(
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

    const date = await this.dateRepository.getById(data.date_id);
    if (!date) {
      throw AppError.NotFound("Date not found");
    }

    if (!Util.ValidCompany(comId, date.route_date_com_id)) {
      throw AppError.Forbidden("Date: Company ID does not match");
    }

    const time = await this.timeRepository.getById(data.time_id);
    if (!time) {
      throw AppError.NotFound("Time not found");
    }

    if (!Util.ValidCompany(comId, time.route_time_com_id)) {
      throw AppError.Forbidden("Time: Company ID does not match");
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

    const date = await this.dateRepository.getById(data.date_id);
    if (!date) {
      throw AppError.NotFound("Date not found");
    }

    if (!Util.ValidCompany(comId, date.route_date_com_id)) {
      throw AppError.Forbidden("Date: Company ID does not match");
    }

    const time = await this.timeRepository.getById(data.time_id);
    if (!time) {
      throw AppError.NotFound("Time not found");
    }

    if (!Util.ValidCompany(comId, time.route_time_com_id)) {
      throw AppError.Forbidden("Time: Company ID does not match");
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
