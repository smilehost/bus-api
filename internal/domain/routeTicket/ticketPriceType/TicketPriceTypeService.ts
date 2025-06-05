import { route_ticket_price_type } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { TicketPriceTypeRepository } from "./TicketPriceTypeRespository";


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

  async editPriceType(comId: number, priceTypeId: number,priceTypeName:string) {
    if (priceTypeName===null||priceTypeName===""){
      throw AppError.BadRequest("priceTypeName can't be empty")
    }

    await this.checkValidPriceType(comId,priceTypeId)

    return this.ticketPriceTypeRepository.editPriceType(priceTypeId,priceTypeName);
  }

  async deletePriceType(comId: number, priceTypeId: number) {
    await this.checkValidPriceType(comId,priceTypeId)

    if (!await this.ticketPriceTypeRepository.isPriceTypeUsage(priceTypeId)){
      throw AppError.Forbidden("This TicketPriceType in used.")
    }
    return this.ticketPriceTypeRepository.deletePriceType(priceTypeId);
  }

  private async checkValidPriceType(comId: number, priceTypeId: number){
    const ticketPriceType = await this.ticketPriceTypeRepository.getTicketPriceTypeById(priceTypeId)
    if (!ticketPriceType) {
      throw AppError.NotFound("Ticket price types not found.");
    }

    if (ticketPriceType.route_ticket_price_type_com_id !== comId) {
      throw AppError.Forbidden(
        "Company ID does not match."
      );
    }

    return ticketPriceType
  }
}
