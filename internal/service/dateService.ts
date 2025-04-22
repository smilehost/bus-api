import { DateRepository } from '../repository/dateRepository';

export class DateService {
  constructor(private readonly dateRepository: DateRepository) {}

  async getAll() {
    return this.dateRepository.getAll();
  }
}