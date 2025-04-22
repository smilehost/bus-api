import { PrismaClient } from '@prisma/client';

export class DateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll() {
    return this.prisma.price_type.findMany();
  }
}