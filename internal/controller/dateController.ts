import { Request, Response } from 'express';
import { DateService } from '../service/dateService';

export class DateController {
  constructor(private readonly dateService: DateService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const priceTypes = await this.dateService.getAll();
      res.json(priceTypes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get price types' });
    }
  };
}