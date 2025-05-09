import { AppError } from "../utils/appError";
import { TicketRemainRepository } from "../repository/ticketRemainRepository";
import { GetRemainByRouteTimeDTO, GetRemainNumberDTO } from "../../cmd/dto";
import { RouteTimeRepository } from "../repository/routeTimeRepository";

export class TicketRemainService {
  constructor(
    private readonly ticketRemainRepository: TicketRemainRepository,
    private readonly timeRepository: RouteTimeRepository
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
    const routeTime = await this.timeRepository.getById(dto.route_time_id)
    if(!routeTime){
      throw AppError.NotFound("route time not found")
    }

    const times = routeTime.route_time_array.split(",").map((t) => t.trim());

    const remains = await this.ticketRemainRepository.findRemainByDate(
      dto.ticket_id,
      dto.ticket_remain_date,
    );

    remains.filter((remain)=>
      times.includes(remain.ticket_remain_time))

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
