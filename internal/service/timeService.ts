import { TimeRepository } from "../repository/timeRepository";
import { CompanyRepository } from "../repository/companyRepository";
import { RouteTime } from "../../cmd/models";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";
import { RouteTimeRequest } from "../../cmd/request";

export class TimeService {
  constructor(
    private readonly timeRepository: TimeRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async getAll(comId: number) {
    return this.timeRepository.getAll(comId);
  }

  async getByPagination(
    comId: number,
    page: number,
    size: number,
    search: string
  ) {
    const skip = (page - 1) * size;
    const take = size;
    search = search.toString();

    const [data, total] = await this.timeRepository.getPaginated(
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

  async getById(comId: number, routeTimeId: number) {
    const routeTime = await this.timeRepository.getById(routeTimeId);

    if (!routeTime) {
      throw AppError.NotFound("Route time not found");
    }

    if (!Util.ValidCompany(comId, routeTime.route_time_com_id)) {
      throw AppError.Forbidden("Route time: Company ID does not match");
    }

    return routeTime;
  }

  async create(comId: number, data: RouteTimeRequest) {
    const company = await this.companyRepository.getById(
      data.route_time_com_id
    );
    if (!company) {
      throw AppError.NotFound("Company not found");
    }

    if (!Util.ValidCompany(comId, data.route_time_com_id)) {
      throw AppError.Forbidden("Route time: Company ID does not match");
    }

    if (
      !Array.isArray(data.route_time_array) ||
      !data.route_time_array.every(
        (t) => typeof t === "string" && isValidTimeFormat(t)
      )
    ) {
      throw AppError.BadRequest(
        "Route time array must be an array of strings in HH:MM format"
      );
    }

    const routeTime: RouteTime = {
      route_time_name: data.route_time_name,
      route_time_array: data.route_time_array.join(","),
      route_time_com_id: data.route_time_com_id,
    };

    return this.timeRepository.create(routeTime);
  }

  async update(
    comId: number,
    routeTimeId: number,
    updateData: Partial<RouteTime>
  ) {
    const existing = await this.timeRepository.getById(routeTimeId);

    if (!existing) {
      throw AppError.NotFound("Route time not found");
    }

    if (!Util.ValidCompany(comId, existing.route_time_com_id)) {
      throw AppError.Forbidden("Route time: Company ID does not match");
    }

    return this.timeRepository.update(routeTimeId, updateData);
  }

  async deleteById(comId: number, routeTimeId: number) {
    const existing = await this.timeRepository.getById(routeTimeId);

    if (!existing) {
      throw AppError.NotFound("Route time not found");
    }

    if (!Util.ValidCompany(comId, existing.route_time_com_id)) {
      throw AppError.Forbidden("Route time: Company ID does not match");
    }

    return this.timeRepository.delete(routeTimeId);
  }
}

const isValidTimeFormat = (value: string): boolean =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
