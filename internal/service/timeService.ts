import { TimeRepository } from "../repository/timeRepository";
import { CompanyRepository } from "../repository/companyRepository";
import { RouteTime } from "../../cmd/models";
import { Util } from "../utils/util";
import { AppError } from "../utils/appError";

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

  async create(comId: number, data: RouteTime) {
    const company = await this.companyRepository.getById(data.route_time_com_id);
    if (!company) {
      throw AppError.NotFound("Company not found");
    }

    if (!Util.ValidCompany(comId, data.route_time_com_id)) {
      throw AppError.Forbidden("Route time: Company ID does not match");
    }

    return this.timeRepository.create(data);
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