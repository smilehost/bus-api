import { AppError } from "../../../utils/appError";
import {
  GetRemainByRouteTimeDTO,
  GetRemainNumberDTO,
  ShiftingRemainDto,
} from "../../../../cmd/dto";
import { ticket_remain } from "@prisma/client";
import { RouteTimeRepository } from "../../route/routeTime/routeTimeRepository";
import { TicketRemainRepository } from "./ticketRemainRepository";
import { TransactionRepository } from "../transaction/transactionRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class TicketRemainService {
  constructor(
    private readonly ticketRemainRepository: TicketRemainRepository,
    private readonly timeRepository: RouteTimeRepository,
    private readonly transactionRepository: TransactionRepository
  ) {}

  endcodeTicketRemainId(data: ShiftingRemainDto): string {
    return `${data.date}_${data.time}_${data.routeTicketId}`;
  }

  decodeTicketRemainId(data: string): ShiftingRemainDto {
    const parts = data.split("_");

    const date = parts[0];
    const time = parts[1];
    const routeTicketIdString = parts[2];

    const routeTicketId = parseInt(routeTicketIdString, 10);
    if (isNaN(routeTicketId)) {
      throw AppError.BadRequest(
        "Invalid ticketRemainId format: RouteTicketId must be a number"
      );
    }
    const maxTicket = 0;
    const amount = 0;

    return {
      date,
      time,
      routeTicketId,
      maxTicket,
      amount,
    };
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

  async getById(
    comId: number,
    ticket_remain_id: string
  ): Promise<ticket_remain> {
    const ticketRemain = await this.ticketRemainRepository.getById(
      ticket_remain_id
    );

    if (!ticketRemain) {
      const routeTicketIdString = ticket_remain_id.split("_")[2];
      const routeTicketId = parseInt(routeTicketIdString, 10);
      if (isNaN(routeTicketId)) {
        throw AppError.BadRequest(
          "Invalid ticket_remain_id format: RouteTicketId must be a number"
        );
      }

      const routeTicket = (await this.transactionRepository.getRouteTicketById(
        routeTicketId
      )) as { route_ticket_amount: number } | null;

      if (!routeTicket) {
        throw AppError.NotFound(
          "Ticket remain not found for this route ticket"
        );
      }

      return {
        ticket_remain_id: "",
        ticket_remain_date: "",
        ticket_remain_time: "",
        ticket_remain_number: routeTicket.route_ticket_amount,
        ticket_remain_route_ticket_id: routeTicketId,
      };
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
    const ticketRemainId = this.endcodeTicketRemainId(increase);
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
    const ticketRemainId = this.endcodeTicketRemainId(decrease);
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
