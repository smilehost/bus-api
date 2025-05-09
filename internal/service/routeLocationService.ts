import { RouteLocation } from "../../cmd/models";
import { RouteLocationRepository } from "../repository/routeLocationRepository";
import { CompanyRepository } from "../repository/companyRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";

export class RouteLocationService {
  constructor(
    private readonly routeLocationRepository: RouteLocationRepository,
    private readonly companyRepository: CompanyRepository
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

  async create(comId: number, data: RouteLocation) {
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

  async update(comId: number, locationId: number, data: RouteLocation) {
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

    return this.routeLocationRepository.delete(locationId);
  }

    // สร้าง service count ตัวเองที่ถูก route ดึงไปใช้ ใว่มีกี่ route ที่ดึงไปใช้ รับ com_id รับ location_id โดยการ query route ทั้งหมด where com_id แล้ว chenk
  // return route ที่ใช้ location นั้นอยู่
}
