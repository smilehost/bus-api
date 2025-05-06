import { RouteTicketPrice } from "../../cmd/models";
import { RouteTicketWithPrices } from "../../cmd/request";
import { RouteRepository } from "../repository/routeRepository";
import { RouteTicketRepository } from "../repository/routeTicketRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";

export class RouteTicketService {
  constructor(
    private readonly routeTicketRepository: RouteTicketRepository,
    private readonly routeRepository: RouteRepository
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

  async getTicketPriceType(comId: number) {
    const ticketPriceTypes = await this.routeTicketRepository.getTicketPriceType(
      comId
    );
    if (!ticketPriceTypes) {
      throw AppError.NotFound("Ticket price types not found");
    }

    return ticketPriceTypes;
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

  async getById(comId: number, ticketId: number,ticketType:number) {
    const priceTable: RouteTicketPrice[][] = []
    const ticket = await this.routeTicketRepository.getById(ticketId,ticketType);

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
    
    if (!prices){
      return {ticket,priceTable}
    }

    if (ticket.route_ticket_type==="fix"){
      priceTable.push(prices)
      return {ticket,priceTable}
    }
    
    const routeLocations = route.route_array.split(",")

    const grouped: Record<string, RouteTicketPrice[]> = {};
    for (const price of prices){
      const start = price.route_ticket_location_start
      if(!grouped[start]){
        grouped[start] = [];
      }
      grouped[start].push(price)
    }

    for (const start of routeLocations){
      if (!grouped[start]) {
        continue
      }

      const sortedStops = grouped[start].sort((a,b)=>
        routeLocations.indexOf(a.route_ticket_location_stop)-
        routeLocations.indexOf(b.route_ticket_location_stop)
      )
      priceTable.push(sortedStops)
    }

    return {ticket,priceTable};
  }

  async create(comId: number, data: RouteTicketWithPrices) {
    return this.routeTicketRepository.create(data);
  }

  async update(comId: number, ticketId: number, data: RouteTicketWithPrices) {
    if (ticketId !== data.route_ticket_id) {
      throw AppError.BadRequest("Route ticket ID does not match");
    }

    const ticket = await this.routeTicketRepository.getById(ticketId,1);
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
}
