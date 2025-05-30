import { AppError } from "../utils/appError";
import { TicketRemainRepository } from "../repository/ticketRemainRepository";
import {
  GetRemainByRouteTimeDTO,
  GetRemainNumberDTO,
  ShiftingRemainDto,
} from "../../cmd/dto";
import { RouteTimeRepository } from "../repository/routeTimeRepository";
import { ticket_remain } from "@prisma/client";

export class TicketRemainService {
  constructor(
    private readonly ticketRemainRepository: TicketRemainRepository,
    private readonly timeRepository: RouteTimeRepository
  ) {}

  private generateTicketRemainId(data: ShiftingRemainDto): string {
    return `${data.date}_${data.time}_${data.routeTicketId}`;
  }

  private async getOrcreateTicket(
    ticketRemainId: string,
    shift: ShiftingRemainDto
  ) {
    let ticketRemain = await this.ticketRemainRepository.getById(
      ticketRemainId
    );

    if (ticketRemain !== null) {

      return ticketRemain;
    }

    ticketRemain = await this.ticketRemainRepository.createRemain({
      ticket_remain_id: ticketRemainId,
      ticket_remain_date: shift.date,
      ticket_remain_time: shift.time,
      ticket_remain_number: shift.maxTicket,
      ticket_remain_route_ticket_id: shift.routeTicketId,
    });

    return ticketRemain;
  }

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
    const routeTime = await this.timeRepository.getById(dto.route_time_id);
    if (!routeTime) {
      throw AppError.NotFound("route time not found");
    }

    const times = routeTime.route_time_array.split(",").map((t) => t.trim());

    const remains = await this.ticketRemainRepository.findRemainByDate(
      dto.ticket_id,
      dto.ticket_remain_date
    );

    const filteredRemains = remains.filter((remain) =>
      times.includes(remain.ticket_remain_time)
    );

    const remainMap = new Map(
      filteredRemains.map((remain) => [remain.ticket_remain_time, remain])
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

  async increaseTicketRemain(
    increase: ShiftingRemainDto
  ): Promise<ticket_remain> {
    const ticketRemainId = this.generateTicketRemainId(increase);
    const ticketRemain = await this.getOrcreateTicket(ticketRemainId, increase);

    if (
      ticketRemain.ticket_remain_number + increase.amount >
      increase.maxTicket
    ) {
      throw AppError.BadRequest(
        "Cannot increasing Remain because it has reached its maximum value."
      );
    }

    // Increase the ticket remain number
    return this.ticketRemainRepository.increaseRemainNumber(
      ticketRemainId,
      increase.amount
    );
  }

  async decreaseTicketRemain(
    decrease: ShiftingRemainDto
  ): Promise<ticket_remain> {
    const ticketRemainId = this.generateTicketRemainId(decrease);
    const ticketRemain = await this.getOrcreateTicket(ticketRemainId, decrease);

    if (ticketRemain.ticket_remain_number < decrease.amount) {
      throw AppError.BadRequest("Remain not enough to decreasing");
    }

    // Decrease the ticket remain number
    return this.ticketRemainRepository.decreaseRemainNumber(
      ticketRemainId,
      decrease.amount
    );
  }
}
