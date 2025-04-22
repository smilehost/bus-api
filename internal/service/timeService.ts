import { TimeRepository } from "../repository/timeRepository";
import { RouteTime } from "../../cmd/models";
import { Util } from "../utils/util";

export class TimeService {
  constructor(private readonly timeRepo: TimeRepository) {}

  async getByPagination(page: number, size: number, search: string) {
    const skip = (page - 1) * size;
    const take = size;
  
    const [data, total] = await this.timeRepo.getPaginated(skip, take, search);
  
    return {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      data,
    };
  }

  async getById(routeTimeId: number, comId: number): Promise<RouteTime | null> {
    const routeTime = await this.timeRepo.getById(routeTimeId);
    if (!Util.ValidCompany(comId, routeTime?.route_time_com_id)) {
      console.error("Invalid company ID");
      return null;
    }
    return routeTime;
  }

  async create(data: RouteTime) {
    try {
      return await this.timeRepo.create(data);
    } catch (error) {
      console.error("Error in TimeService.create:", error);
      throw new Error("Failed to create route_time");
    }
  }

  async update(
    comId: number,
    routeTimeId: number,
    updateData: Partial<RouteTime>
  ) {
    const existing = await this.timeRepo.getById(routeTimeId);
    if (!existing) {
      throw new Error("Route time not found");
    }

    if (!Util.ValidCompany(existing.route_time_com_id, comId)) {
      throw new Error("Permission denied: com_id mismatch");
    }

    // ✅ อัปเดตข้อมูล
    return this.timeRepo.update(routeTimeId, updateData);
  }

  async deleteById(comId: number, routeTimeId: number) {
    const existing = await this.timeRepo.getById(routeTimeId);

    if (!existing) {
      return null; // ไม่เจอ
    }

    if (!Util.ValidCompany(existing.route_time_com_id, comId)) {
      return null; // com_id ไม่ตรง
    }

    return this.timeRepo.delete(routeTimeId);
  }
}
