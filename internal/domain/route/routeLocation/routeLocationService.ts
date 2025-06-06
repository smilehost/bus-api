
import { route_location } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { Util } from "../../../utils/util";
import { CompanyRepository } from "../../company/company/companyRepository";
import { RouteService } from "../route/routeService";
import { RouteLocationRepository } from "./routeLocationRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class RouteLocationService {
  constructor(
    private readonly routeLocationRepository: RouteLocationRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly routeService: RouteService,
  ) {}

  async getAll(comId: number) {
    return this.routeLocationRepository.getAll(comId);
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

    const [data, total] = await this.routeLocationRepository.getPaginated(
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

  async getById(comId: number, locationId: number) {
    const location = await this.routeLocationRepository.getById(locationId);

    if (!location) {
      throw AppError.NotFound("Route location not found");
    }

    if (!Util.ValidCompany(comId, location.route_location_com_id)) {
      throw AppError.Forbidden("Route location: Company ID does not match");
    }

    return location;
  }

  async create(comId: number, data: route_location) {
    const company = await this.companyRepository.getById(
      data.route_location_com_id
    );
    if (!company) {
      throw AppError.NotFound("Company not found");
    }

    if (!Util.ValidCompany(comId, data.route_location_com_id)) {
      throw AppError.Forbidden("Route location: Company ID does not match");
    }

    return this.routeLocationRepository.create(data);
  }

  async update(comId: number, locationId: number, data: route_location) {
    const company = await this.companyRepository.getById(
      data.route_location_com_id
    );
    if (!company) {
      throw AppError.NotFound("Company not found");
    }

    const existing = await this.routeLocationRepository.getById(locationId);
    if (!existing) {
      throw AppError.NotFound("Route location not found");
    }

    if (!Util.ValidCompany(comId, existing.route_location_com_id)) {
      throw AppError.Forbidden("Route location: Company ID does not match");
    }

    return this.routeLocationRepository.update(locationId, data);
  }

  async delete(comId: number, locationId: number) {
    const existing = await this.routeLocationRepository.getById(locationId);
    if (!existing) {
      throw AppError.NotFound("Route location not found");
    }
  
    if (!Util.ValidCompany(comId, existing.route_location_com_id)) {
      throw AppError.Forbidden("Route location: Company ID does not match");
    }
  
    const routes = await this.routeService.getRoutesUsingLocation(comId, locationId);
  
    if (routes.length > 0) {
      throw AppError.BadRequest(
        `ไม่สามารถลบจุดจอดนี้ได้ เนื่องจากถูกใช้งานอยู่ใน ${routes.length} เส้นทาง`
      );
    }
  
    return this.routeLocationRepository.delete(locationId);
  }
}
