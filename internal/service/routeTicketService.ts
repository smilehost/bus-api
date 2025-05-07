import { RouteTicketPrice } from "../../cmd/models";
import { RouteTicketWithPrices } from "../../cmd/request";
import { RouteTicketPriceType } from "../../cmd/models";
import { RouteRepository } from "../repository/routeRepository";
import { RouteTicketRepository } from "../repository/routeTicketRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { RouteService } from "./routeService";

export class RouteTicketService {
  constructor(
    private readonly routeTicketRepository: RouteTicketRepository,
    private readonly routeRepository: RouteRepository,
    private readonly routeService:RouteService,
  ) {}

  async getAllTicketsByRouteId(comId: number, routeId: number) {
    const route = await this.routeRepository.getById(routeId);
    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    const tickets = await this.routeTicketRepository.getAllTicketsByRouteId(routeId);
    return tickets;
  }

  async getPricingByLocation(startId:string,stopId:string,routeId:number){
    const tickets = await this.routeTicketRepository.getAllTicketsByRouteId(routeId);
    const prices = await this.routeTicketRepository.getPricingByLocation(routeId,startId,stopId)

    
  }

  async getByPagination(
    comId: number,
    page: number,
    size: number,
    search: string
  ) {
    const skip = (page - 1) * size;
    const take = size;
    search = search.toString();

    const [data, total] = await this.routeTicketRepository.getPaginated(
      comId,
      skip,
      take,
      search
    );

    return {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      data,
    };
  }

  async getById(comId: number, ticketId: number) {
    const ticket = await this.routeTicketRepository.getById(ticketId);

    if (!ticket) {
      throw AppError.NotFound("Route ticket not found");
    }

    const route = await this.routeRepository.getById(
      ticket.route_ticket_route_id
    );

    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    const prices = await this.routeTicketRepository.getTicketPrices(ticketId)
    return {ticket,prices}
  }

  async create(comId: number, data: RouteTicketWithPrices) {
    return this.routeTicketRepository.create(data);
  }

  async update(comId: number, ticketId: number, data: RouteTicketWithPrices) {
    if (ticketId !== data.route_ticket_id) {
      throw AppError.BadRequest("Route ticket ID does not match");
    }

    const ticket = await this.routeTicketRepository.getById(ticketId);
    if (!ticket) {
      throw AppError.NotFound("Route ticket not found");
    }

    const route = await this.routeRepository.getById(
      ticket.route_ticket_route_id
    );
    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    return await this.routeTicketRepository.update(ticketId, data);
  }

  async delete(comId: number, ticketId: number) {
    const ticket = await this.routeTicketRepository.getById(ticketId);
    if (!ticket) {
      throw AppError.NotFound("Route ticket not found");
    }

    const route = await this.routeRepository.getById(
      ticket.route_ticket_route_id
    );
    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    return await this.routeTicketRepository.delete(ticketId);
  }

  async getTicketPriceType(comId: number) {
    const ticketPriceTypes = await this.routeTicketRepository.getTicketPriceType(
      comId
    );
    if (!ticketPriceTypes) {
      throw AppError.NotFound("Ticket price types not found");
    }

    return ticketPriceTypes;
  }

  async createPriceType(comId: number, data: RouteTicketPriceType) {
    if (data.route_ticket_price_type_com_id !== comId) {
      throw AppError.Forbidden("Company ID does not match for price type creation");
    }

    return this.routeTicketRepository.createPriceType(comId, data);
  }

  async deletePriceType(comId: number, priceTypeId: number) {
    return this.routeTicketRepository.deletePriceType(comId, priceTypeId);
  }

  async getTicketsByLocations(com_id:number,startId:number,stopId:number,date:string){
    const routes = await this.routeService.getRouteByLocations(
      com_id,
      startId,
      stopId,
      date
    );
  }

}
