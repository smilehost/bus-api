// path: internal/repository/discountRepository.ts
import { ticket_discount, PrismaClient } from "@prisma/client";
import { createDiscountDto } from "../../../../cmd/dto";
import { AppError } from "../../../utils/appError";

export class DiscountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId:number) {
    try {
      return await this.prisma.ticket_discount.findMany({
        where:{ticket_discount_com_id:comId}
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(ticket_discount_id: number) {
    try {
      return await this.prisma.ticket_discount.findUnique({
        where: { ticket_discount_id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: createDiscountDto) {
    try {
      return await this.prisma.ticket_discount.create({
        data,
      });
    } catch (error) {
      console.log(error)
      throw AppError.fromPrismaError(error);
    }
  }

  async update(ticket_discount_id: number, data: Partial<ticket_discount>) {
    try {
      return await this.prisma.ticket_discount.update({
        where: { ticket_discount_id },
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(ticket_discount_id: number) {
    try {
      return await this.prisma.ticket_discount.delete({
        where: { ticket_discount_id:ticket_discount_id },
      });
    } catch (error) {
      console.log(error)
      throw AppError.fromPrismaError(error);
    }
  }
}
