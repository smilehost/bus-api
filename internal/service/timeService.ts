import { TimeRepository } from '../repository/timeRepository';
import { RouteTime } from '../../cmd/models';

export class TimeService {
  constructor(private readonly timeRepo: TimeRepository) {}

  async create(data: RouteTime) {
    try {
      return await this.timeRepo.create(data);
    } catch (error) {
      console.error('Error in TimeService.create:', error);
      throw new Error('Failed to create route_time');
    }
  }
}