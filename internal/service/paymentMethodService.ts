import { PrismaClient, payment_method } from "@prisma/client";
import { AppError } from "../utils/appError";
import { PaymentMethodRepository } from "../repository/PaymentMethodRepository";

export class PaymentMethodService {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository
  ) {}

  async createPaymentMethod(data: Omit<payment_method, 'payment_method_id'>) {
    return await this.paymentMethodRepository.create(data);
  }

  async getAllPaymentMethods() {
    return await this.paymentMethodRepository.getAll();
  }

  async getPaymentMethodById(id: number) {
    const paymentMethod = await this.paymentMethodRepository.getById(id);
    if (!paymentMethod) {
      throw AppError.NotFound(`Payment method with ID ${id} not found`);
    }
    return paymentMethod;
  }

  async getActivePaymentMethods() {
    return await this.paymentMethodRepository.getActivePaymentMethods();
  }

  async updatePaymentMethod(id: number, data: Partial<Omit<payment_method, 'payment_method_id'>>) {
    const paymentMethod = await this.paymentMethodRepository.getById(id);
    if (!paymentMethod) {
      throw AppError.NotFound(`Payment method with ID ${id} not found`);
    }
    return await this.paymentMethodRepository.update(id, data);
  }

  async deletePaymentMethod(id: number) {
    const paymentMethod = await this.paymentMethodRepository.getById(id);
    if (!paymentMethod) {
      throw AppError.NotFound(`Payment method with ID ${id} not found`);
    }
    return await this.paymentMethodRepository.delete(id);
  }

  async activatePaymentMethod(id: number) {
    const paymentMethod = await this.paymentMethodRepository.getById(id);
    if (!paymentMethod) {
      throw AppError.NotFound(`Payment method with ID ${id} not found`);
    }
    return await this.paymentMethodRepository.updateStatus(id, 1);
  }

  async deactivatePaymentMethod(id: number) {
    const paymentMethod = await this.paymentMethodRepository.getById(id);
    if (!paymentMethod) {
      throw AppError.NotFound(`Payment method with ID ${id} not found`);
    }
    return await this.paymentMethodRepository.updateStatus(id, 0);
  }
}
