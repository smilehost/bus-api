// path: internal/service/discountService.ts
import { DiscountRepository } from "../repository/discountRepository";
import { AppError } from "../utils/appError";
import { ticket_discount } from "@prisma/client";
import { Util } from "../utils/util";
import { createDiscountDto } from "../../cmd/dto";

export class DiscountService {
  constructor(private readonly discountRepository: DiscountRepository) {}

  async getAll(comId: number) {
    return await this.discountRepository.getAll(comId);
  }

  async getById(comId: number, ticket_discount_id: number) {
    const discount = await this.discountRepository.getById(ticket_discount_id);

    if (!discount) {
      throw AppError.NotFound("Discount not found");
    }

    if (!Util.ValidCompany(comId, discount.ticket_discount_com_id)) {
      throw AppError.Forbidden("Discount: Company ID does not match");
    }

    return discount;
  }

  async create(comId: number, data: createDiscountDto) {
    const createData: Omit<ticket_discount, "ticket_discount_id"> = {
      ticket_discount_name: data.ticket_discount_name,
      ticket_discount_type: data.ticket_discount_type,
      ticket_discount_status: 1,
      ticket_discount_value: data.ticket_discount_value,
      ticket_discount_com_id: comId,
    };

    return this.discountRepository.create(createData);
  }

  async update(
    comId: number,
    ticket_discount_id: number,
    data: Partial<ticket_discount>
  ) {
    const existing = await this.discountRepository.getById(ticket_discount_id);
    if (!existing) {
      throw AppError.NotFound("Discount not found");
    }

    if (!Util.ValidCompany(comId, existing.ticket_discount_com_id)) {
      throw AppError.Forbidden("Discount: Company ID does not match");
    }

    return this.discountRepository.update(ticket_discount_id, data);
  }

  async changeStatus(
    comId: number,
    ticket_discount_id: number,
    status:number
  ) {
    const discount = await this.discountRepository.getById(ticket_discount_id);
    if (!discount) {
      throw AppError.NotFound("Discount not found");
    }

    if (!Util.ValidCompany(comId, discount.ticket_discount_com_id)) {
      throw AppError.Forbidden("Discount: Company ID does not match");
    }

    if (status !== 1 && status !== 0){
      throw AppError.Forbidden("Invalid Status");
    }

    discount.ticket_discount_status = status
    return this.discountRepository.update(ticket_discount_id,discount);
  }

  async deleteById(comId: number, ticket_discount_id: number) {
    const existing = await this.discountRepository.getById(ticket_discount_id);

    if (!existing) {
      throw AppError.NotFound("Discount not found");
    }

    if (!Util.ValidCompany(comId, existing.ticket_discount_com_id)) {
      throw AppError.Forbidden("Discount: Company ID does not match");
    }

    return this.discountRepository.delete(ticket_discount_id);
  }
}
