import { RouteDate } from '../../cmd/models';
import { DateRepository } from '../repository/dateRepository';

export class DateService {
  constructor(private readonly dateRepository: DateRepository) {}

  getAll() {
    return this.dateRepository.getAll();
  }

  getById(id: number) {
    return this.dateRepository.getById(id);
  }

  create(data: RouteDate) {
    return this.dateRepository.create(data);
  }

  update(id: number, data: Partial<RouteDate>) {
    return this.dateRepository.update(id, data);
  }

  delete(id: number) {
    return this.dateRepository.delete(id);
  }
}