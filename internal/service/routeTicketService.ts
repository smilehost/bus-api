import {   } from "../../cmd/models";
import { RouteTicketWithPrices } from "../../cmd/request";
import { RouteRepository } from "../repository/routeRepository";
import { RouteTicketRepository } from "../repository/routeTicketRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { RouteService } from "./routeService";
import { TicketRemainService } from "./ticketRemainService";
import { GetRemainByRouteTimeDTO } from "../../cmd/dto";
import { route, route_ticket, route_ticket_price_type } from "@prisma/client";

export class RouteTicketService {
  constructor(
    private readonly routeTicketRepository: RouteTicketRepository,
    private readonly routeRepository: RouteRepository,
    private readonly routeService:RouteService,
    private readonly ticketRemainService:TicketRemainService,
  ) {}

  async getAllTicketsByRouteId(comId: number, routeId: number) {
    const route = await this.routeRepository.getById(routeId);
    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    const tickets = await this.routeTicketRepository.getAllTicketsByRouteId(
      routeId
    );
    return tickets;
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

    const prices = await this.routeTicketRepository.getTicketPrices(ticketId);
    return { ticket, prices };
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
    const ticketPriceTypes =
      await this.routeTicketRepository.getTicketPriceType(comId);
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

    return this.routeTicketRepository.createPriceType(comId, data);
  }

  async deletePriceType(comId: number, priceTypeId: number) {
    return this.routeTicketRepository.deletePriceType(comId, priceTypeId);
  }

  async getTicketsByLocations(
    com_id: number,
    startId: number,
    stopId: number,
    date: string
  ) {
    const routes = await this.routeService.getRouteByLocations(
      com_id,
      startId,
      stopId,
      date
    );

    const getPrices = async (ticketId: number, ticketType: string) => {
      if (ticketType !== "tier") {
        const fixTicket =
          await this.routeTicketRepository.getTicketPricingByLocation(ticketId);

        fixTicket.forEach((ticket) => {
          ticket.route_ticket_location_start = String(startId);
          ticket.route_ticket_location_stop = String(stopId);
        });

        return fixTicket;
      }
      
      return await this.routeTicketRepository.getTicketPricingByLocation(
        ticketId,
        String(startId),
        String(stopId)
      );
    };

    const getRemaining = async (ticket:route_ticket,routeTimeId:number)=>{
      const ticketTime:GetRemainByRouteTimeDTO = {
        ticket_id:ticket.route_ticket_id,
        ticket_remain_date:date,
        route_time_id:routeTimeId,
      }
      const remaining = await this.ticketRemainService.getRemainByRouteTime(ticketTime)
      return remaining
    }
  
    const processRoute = async (route: route): Promise<route_ticket[]> => {
      const tickets = await this.routeTicketRepository.getAllTicketsByRouteId(route.route_id);
      if (!tickets.length) return [];

      const ticketsWithPrices = await Promise.all(
        tickets.map(async (ticket) => ({
          ...ticket,
          locations: await this.routeService.getStartEndLocation(route),
          prices: await getPrices(ticket.route_ticket_id, ticket.route_ticket_type),
          ticket_remain: await getRemaining(ticket,route.route_time_id)
        }))
      );

      return ticketsWithPrices;
    };

    const ticketWithPrices = await Promise.all(routes.map(processRoute));

    return ticketWithPrices;
  }
}
