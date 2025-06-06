import { RouteTicketWithPrices } from "../../../../cmd/request";

import { TicketRemainService } from "../../transaction/ticketRemain/ticketRemainService";
import { GetRemainByRouteTimeDTO } from "../../../../cmd/dto";
import { route, route_ticket, route_time } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { Util } from "../../../utils/util";
import { RouteRepository } from "../../route/route/routeRepository";
import { RouteService } from "../../route/route/routeService";
import { RouteTicketRepository } from "./routeTicketRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class RouteTicketService {
  constructor(
    private readonly routeTicketRepository: RouteTicketRepository,
    private readonly routeRepository: RouteRepository,
    private readonly routeService: RouteService,
    private readonly ticketRemainService: TicketRemainService
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
    search: string,
    status: number
  ) {
    // คำนวณการข้ามและจำนวนข้อมูลที่จะดึง
    const skip = (page - 1) * size;
    const take = size;
    search = search.toString();

    // ดึงข้อมูลแบบแบ่งหน้าจาก repository
    const [data, total] = await this.routeTicketRepository.getPaginated(
      comId,
      skip,
      take,
      search,
      status
    );

    // คืนค่าข้อมูลพร้อมรายละเอียดการแบ่งหน้า
    return {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      data,
    };
  }

  async getById(comId: number, ticketId: number) {
    // ค้นหาตั๋วตาม ID
    const ticket = await this.routeTicketRepository.getById(ticketId);

    if (!ticket) {
      throw AppError.NotFound("Route ticket not found");
    }

    // ค้นหาเส้นทางของตั๋ว
    const route = await this.routeRepository.getById(
      ticket.route_ticket_route_id
    );

    if (!route) {
      throw AppError.NotFound("Route not found");
    }

    // ตรวจสอบสิทธิ์ของบริษัท
    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    // ดึงข้อมูลราคาของตั๋ว
    const prices = await this.routeTicketRepository.getTicketPrices(ticketId);
    return { ticket, prices };
  }

  async create(comId: number, data: RouteTicketWithPrices) {
    const route = await this.routeRepository.getById(data.route_ticket_route_id);
    if (!route) {
      throw AppError.NotFound("Route not found");
    }
    if (!Util.ValidCompany(comId, route.route_com_id)) {
      throw AppError.Forbidden("Route ticket: Company ID does not match");
    }

    // หากเป็นตั๋วประเภท "fix" จะกรองราคาให้เหลือเฉพาะต้นทางและปลายทางของเส้นทาง
    if (data.route_ticket_type === "fix") {
      const locations = await this.routeService.getStartEndLocation(route);

      data.route_ticket_price = data.route_ticket_price.filter((price) => {
        return (
          price.route_ticket_location_start ===
            locations.startLocation.route_location_id &&
          price.route_ticket_location_stop ===
            locations.stopLocation.route_location_id
        );
      });
    }
    // สร้างตั๋วใน repository
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

  async updateStatus(comId: number, ticketId: number, status: number) {
    Util.isVaildStatus(status);

    const ticket = await this.routeTicketRepository.getById(ticketId);
    if (!ticket) {
      throw AppError.NotFound("Route ticket not found");
    }
    return await this.routeTicketRepository.updateStatus(ticketId, status);
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

  async getTicketsByLocations(
    com_id: number,
    startId: number,
    stopId: number,
    date: string
  ) {
    // ค้นหาเส้นทางทั้งหมดที่ผ่านสถานที่ต้นทางและปลายทางที่กำหนด
    const routes = await this.routeService.getRouteByLocations(
      com_id,
      startId,
      stopId,
      date
    );

    // ดึงข้อมูลตั๋วสำหรับแต่ละเส้นทางพร้อมกัน
    const ticketWithPrices = await Promise.all(
      routes.map(async (route) => {
        const tickets = await this.findRouteTicket(route, route.route_time);
        return tickets;
      })
    );

    // รวมผลลัพธ์จากทุกเส้นทางให้เป็น array เดียว
    return ticketWithPrices.flat();
  }

  private async findRouteTicket(
    route: route,
    times: route_time
  ): Promise<route_ticket[]> {
    // ค้นหาตั๋วทั้งหมดในเส้นทาง
    const tickets = await this.routeTicketRepository.findTicketsByRouteId(
      route.route_id
    );
    if (!tickets.length) return [];

    // เพิ่มข้อมูลเส้นทางและสถานที่เริ่มต้น-สิ้นสุดให้กับแต่ละตั๋ว
    const ticketsdata = await Promise.all(
      tickets.map(async (ticket) => ({
        ...ticket,
        route: {
          route_name: route.route_name_th,
          route_time: times,
        },
        locations: await this.routeService.getStartEndLocation(route),
      }))
    );

    return ticketsdata;
  }

  async getPriceByRouteTicket(
    ticketId: number,
    startId: number,
    stopId: number
  ) {
    const ticket = await this.routeTicketRepository.getById(ticketId);
    // ตรวจสอบประเภทของตั๋ว ถ้าไม่ใช่ "tier" ให้ดึงราคาแบบ fix
    if (ticket?.route_ticket_type !== "tier") {
      const fixTicket =
        await this.routeTicketRepository.getTicketPricingByLocation(ticketId);
      return fixTicket;
    }
    // ดึงราคาตั๋วตามสถานที่เริ่มต้นและสิ้นสุดสำหรับตั๋วประเภท "tier"
    return await this.routeTicketRepository.getTicketPricingByLocation(
      ticketId,
      String(startId),
      String(stopId)
    );
  }
}
