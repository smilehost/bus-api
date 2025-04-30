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

  async getTicketPriceType(comId: number) {
    const ticketPriceTypes = await this.ticketRepository.getTicketPriceType(comId);
    if (!ticketPriceTypes) {
      throw AppError.NotFound("Ticket price types not found");
    }

    return ticketPriceTypes;
  }

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

  async update(comId: number, ticketId: number, data: RouteTicketWithPrices) {
    if (ticketId !== data.route_ticket_id) {
      throw AppError.BadRequest("Route ticket ID does not match");
    }

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

    
  
    return await this.ticketRepository.update(ticketId, data);
  }
}
