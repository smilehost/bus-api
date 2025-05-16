import { route_ticket_price_type } from "@prisma/client";
import { TicketPriceTypeRepository } from "../repository/TicketPriceTypeRespository";
import { AppError } from "../utils/appError";

export class TicketPriceTypeService {
  constructor(
    private readonly ticketPriceTypeRepository: TicketPriceTypeRepository
  ) {}

  async getTicketPriceType(comId: number) {
    const ticketPriceTypes =
      await this.ticketPriceTypeRepository.getTicketPriceType(comId);
    if (!ticketPriceTypes) {
      throw AppError.NotFound("Ticket price types not found");
    }

    return ticketPriceTypes;
  }

  async createPriceType(comId: number, data: route_ticket_price_type) {
    if (data.route_ticket_price_type_com_id !== comId) {
      throw AppError.Forbidden(
        "Company ID does not match for price type creation"
      );
    }

    return this.ticketPriceTypeRepository.createPriceType(comId, data);
  }

  async deletePriceType(comId: number, priceTypeId: number) {
    return this.ticketPriceTypeRepository.deletePriceType(comId, priceTypeId);
  }
}
