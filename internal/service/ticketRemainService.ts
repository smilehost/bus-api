import { AccountRepository } from "../repository/accountRepository";
import { Account } from "../../cmd/models";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { TicketRemainRepository } from "../repository/ticketRemainRepository";
import { GetRemainByRouteTimeDTO, GetRemainNumberDTO } from "../../cmd/dto";

export class TicketRemainService {
  constructor(
    private readonly ticketRemainRepository: TicketRemainRepository
  ) {}

  async getById(comId: number, ticket_remain_id: string) {
    const ticketRemain = await this.ticketRemainRepository.getById(
      ticket_remain_id
    );

    if (!ticketRemain) {
      throw AppError.NotFound("Ticket remain not found");
    }

    return ticketRemain;
  }

  async getRemainNumber(dto: GetRemainNumberDTO): Promise<number> {
    const {
      ticket_remain_date,
      ticket_remain_time,
      ticket_remain_route_ticket_id,
    } = dto;

    if (
      !ticket_remain_date ||
      !ticket_remain_time ||
      !ticket_remain_route_ticket_id
    ) {
      throw AppError.BadRequest("Missing required fields");
    }

    return this.ticketRemainRepository.getRemainNumber(
      ticket_remain_date,
      ticket_remain_time,
      ticket_remain_route_ticket_id
    );
  }

  async getRemainByRouteTime(dto: GetRemainByRouteTimeDTO) {
    const times = dto.ticket_remain_time.split(",").map((t) => t.trim());

    const remains = await this.ticketRemainRepository.findByTicketIdDateAndTimes(
      dto.ticket_id,
      dto.ticket_remain_date,
      times
    );

    const remainMap = new Map(
      remains.map((remain) => [remain.ticket_remain_time, remain])
    );

    return times.map((time) => {
      const found = remainMap.get(time);
      return (
        found ?? {
          ticket_remain_id: null,
          ticket_remain_date: dto.ticket_remain_date,
          ticket_remain_time: time,
          ticket_remain_number: null,
          ticket_remain_route_ticket_id: dto.ticket_id,
        }
      );
    });
  }
}
