import { RouteTicketWithPrices } from "../../cmd/request";
import { RouteRepository } from "../repository/routeRepository";
import { TicketRepository } from "../repository/ticketRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";

export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly routeRepository: RouteRepository
  ) {}

  async getById(comId: number, ticketId: number) {
    const ticket = await this.ticketRepository.getById(ticketId);

    if (!ticket) {
      throw AppError.NotFound("Route ticket not found");
    }

    const route = await this.routeRepository.getById(ticket.route_ticket_route_id);
    
    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    return ticket;
  }

  async create(comId: number, data: RouteTicketWithPrices) {
    return this.ticketRepository.create(data);
  }
}
