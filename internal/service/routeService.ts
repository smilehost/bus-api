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
}
