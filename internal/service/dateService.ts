import { RouteDate } from '../../cmd/models';
import { DateRepository } from '../repository/dateRepository';
import { AppError } from '../utils/appError';
import { Util } from '../utils/util';

export class DateService {
  constructor(private readonly dateRepository: DateRepository) {}

  getAll() {
    return this.dateRepository.getAll();
  }

  getById(id: number) {
    return this.dateRepository.getById(id);
  }

  create(comId: number,data: RouteDate) {
    if (Util.ValidCompany(comId, data.route_date_com_id) === false) {
      throw AppError.Forbidden("Company ID does not match");
    }

    const days = [
      data.route_date_sun,
      data.route_date_mon,
      data.route_date_tue,
      data.route_date_wen,
      data.route_date_thu,
      data.route_date_fri,
      data.route_date_sat,
     ] 
     
    if (days.some(day => (day !== 0 && day !== 1))){
        throw AppError.BadRequest("Invalid Day Format")
    }

    return this.dateRepository.create(data);
  }

  update(id: number, data: Partial<RouteDate>) {
    return this.dateRepository.update(id, data);
  }

  delete(id: number) {
    return this.dateRepository.delete(id);
  }
}