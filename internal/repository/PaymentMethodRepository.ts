import { PrismaClient, payment_method } from "@prisma/client";
import { AppError } from "../utils/appError";

export class PaymentMethodRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Omit<payment_method, 'payment_method_id'>) {
    try {
      return await this.prisma.payment_method.create({
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getAll() {
    try {
      return await this.prisma.payment_method.findMany();
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(payment_method_id: number) {
    try {
      return await this.prisma.payment_method.findUnique({
        where: { payment_method_id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getActivePaymentMethods() {
    try {
      return await this.prisma.payment_method.findMany({
        where: { payment_method_status: 1 },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(payment_method_id: number, data: Partial<Omit<payment_method, 'payment_method_id'>>) {
    try {
      return await this.prisma.payment_method.update({
        where: { payment_method_id },
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(payment_method_id: number) {
    try {
      return await this.prisma.payment_method.delete({
        where: { payment_method_id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async updateStatus(payment_method_id: number, status: number) {
    try {
      return await this.prisma.payment_method.update({
        where: { payment_method_id },
        data: { payment_method_status: status },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
