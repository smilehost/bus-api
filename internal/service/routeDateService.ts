import { RouteDate } from "../../cmd/models";
import { RouteDateRepository } from "../repository/routeDateRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";

export class RouteDateService {
  constructor(private readonly routeDateRepository: RouteDateRepository) {}

  async getAll(comId: number) {
    return this.routeDateRepository.getAll(comId);
  }

  async getByPagination(
    comId: number,
    page: number,
    size: number,
    search: string
  ) {
    search = search.toString();

    const skip = (page - 1) * size;
    const take = size;

    const [data, total] = await this.routeDateRepository.getPaginated(
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

  async getById(comId: number, id: number) {
    const routeDate = await this.routeDateRepository.getById(id);
    if (!routeDate) {
      throw AppError.NotFound("Route not found");
    }

    if (Util.ValidCompany(comId, routeDate.route_date_com_id) === false) {
      throw AppError.Forbidden("Company ID does not match");
    }

    return routeDate;
  }

  create(comId: number, data: RouteDate) {
    if (!Util.ValidCompany(comId, data.route_date_com_id)) {
      throw AppError.Forbidden("Company ID does not match");
    }

    if (this.validDateFormat(data)) {
      throw AppError.BadRequest("Invalid Day Format");
    }

    return this.routeDateRepository.create(data);
  }

  async update(comId: number, id: number, data: RouteDate) {
    const routeDate = await this.routeDateRepository.getById(id);
    if (!routeDate) {
      throw AppError.NotFound("Route date not found");
    }

    if (!Util.ValidCompany(comId, routeDate.route_date_com_id)) {
      throw AppError.Forbidden("Company ID does not match");
    }

    if (this.validDateFormat(data)) {
      throw AppError.BadRequest("Invalid Day Format");
    }

    return this.routeDateRepository.update(id, data);
  }

  async delete(comId: number, id: number) {
    const routeDate = await this.routeDateRepository.getById(id);
    if (!routeDate) {
      throw AppError.NotFound("Route date not found");
    }

    if (Util.ValidCompany(comId, routeDate.route_date_com_id) === false) {
      throw AppError.Forbidden("Company ID does not match");
    }

    return this.routeDateRepository.delete(id);
  }

  validDateFormat(date: RouteDate) {
    const days = [
      date.route_date_sun,
      date.route_date_mon,
      date.route_date_tue,
      date.route_date_wen,
      date.route_date_thu,
      date.route_date_fri,
      date.route_date_sat,
    ];

    return days.some((day) => day !== 0 && day !== 1);
  }
}
