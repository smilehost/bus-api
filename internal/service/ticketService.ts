// path: internal/service/ticketService.ts
import { TicketRepository } from "../repository/ticketRepository";
import { AppError } from "../utils/appError";
import { ticket } from "@prisma/client";
import { CreateTicketDto, ShiftingRemainDto } from "../../cmd/dto";
import { TicketRemainService } from "./ticketRemainService";

export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketRemainService: TicketRemainService,
  ) {}

  async createTicketsForTransaction(
    com_id: number,
    transactionId: number,
    ticketsDto: CreateTicketDto[]
  ): Promise<ticket[]> {

    const ticketsData: Omit<ticket, "ticket_id">[] = [];
    const ticketGroups: Record<string, CreateTicketDto[]> = {};

    for (const t of ticketsDto) {
      const dateStr = t.ticket_date;
      if (!ticketGroups[dateStr]) {
        ticketGroups[dateStr] = [];
      }
      ticketGroups[dateStr].push(t);
    }

    for (const [date, dtosInGroup] of Object.entries(ticketGroups)) {
      const prefix = this.getPrefix(com_id, date);
      let nextSuffix = "0000"; // default starting point
      const latestTicket = await this.ticketRepository.getLastByPrefix(prefix);
      if (latestTicket && latestTicket.ticket_uuid) {
        const parts = latestTicket.ticket_uuid.split("-");
        if (parts.length > 2) {
          nextSuffix = parts[parts.length - 1];
        }
      }

      for (const ticketDto of dtosInGroup) {
        nextSuffix = this.incrementAlphaNum(nextSuffix);
        const newTicketObject: Omit<ticket, "ticket_id"> = {
          ...ticketDto, // Spread all fields from CreateTicketDto
          ticket_status: "active", // Override status
          ticket_date: date, // Override date (date is string from ticketGroups)
          ticket_transaction_id: transactionId, // Set transaction_id
          ticket_uuid: `${prefix}-${nextSuffix}`, // Set UUID
        };

        ticketsData.push(newTicketObject);
      }
    }
    return await this.ticketRepository.createMany(ticketsData);
  }

  async getTicketById(ticketId: number): Promise<ticket | null> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw AppError.NotFound("Ticket not found");
    }
    return ticket;
  }

  async ticketReschedule(comId:number,ticket_uuid:string,newDate:string,newTime:string){
    const ticket = await this.ticketRepository.findByUUID(ticket_uuid)
    if (!ticket) {
      throw AppError.NotFound("Ticket not found");
    }
    const oldSchedule:ShiftingRemainDto = {
      date:ticket.ticket_date,
      time:ticket.ticket_time,
      routeTicketId:ticket.ticket_route_ticket_id,
      maxTicket:ticket.route_ticket.route_ticket_amount,
      amount:1
    }

    const newSchedule:ShiftingRemainDto = {
      date:newDate,
      time:newTime,
      routeTicketId:ticket.ticket_route_ticket_id,
      maxTicket:ticket.route_ticket.route_ticket_amount,
      amount:1
    }

    const { ticket_id, ...newTicketData }: ticket = ticket;
    newTicketData.ticket_date = newDate
    newTicketData.ticket_time = newTime
    const prefix = this.getPrefix(comId,newDate)
    await this.ticketRepository.getLastByPrefix(prefix)
    

    const newTicket = await this.ticketRepository.createTicket(newTicketData)
    await this.ticketRemainService.increaseTicketRemain(oldSchedule)
  }

  async getByPagination(
    comId: number,
    page: number,
    size: number,
    seacrh: string,
    status?: string
  ): Promise<{
    tickets: ticket[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    if (page <= 0) throw AppError.BadRequest("Page must be greater than 0");
    if (size <= 0) throw AppError.BadRequest("Limit must be greater than 0");

    const { tickets, total } = await this.ticketRepository.findAll(
      comId,
      page,
      size,
      seacrh,
      status
    );
    return {
      tickets,
      total,
      totalPages: Math.ceil(total / size),
      currentPage: page,
    };
  }

  private async generateUUID(com_id:number,date:string){
    const prefix = this.getPrefix(com_id, date);
    let nextSuffix = "0000"; // default starting point
    const latestTicket = await this.ticketRepository.getLastByPrefix(prefix);
    if (latestTicket && latestTicket.ticket_uuid) {
      const parts = latestTicket.ticket_uuid.split("-");
      if (parts.length > 2) {
        nextSuffix = parts[parts.length - 1];
      }
    }
  }

  private getPrefix(com_id: number, travelDate: string): string {
    const date = new Date(travelDate);
    const mmyy = date
      .toLocaleDateString("en-GB", {
        month: "2-digit",
        year: "2-digit",
      })
      .replace("/", "");
    return `${com_id}-${mmyy}`;
  }

  private incrementAlphaNum(input: string): string {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Ensure this matches original if order matters
    let arr = input.split("");
    let i = arr.length - 1;

    while (i >= 0) {
      const charIndex = chars.indexOf(arr[i]);
      if (charIndex === -1)
        throw new Error(
          "Invalid character in alphanumeric string for increment"
        );

      if (charIndex < chars.length - 1) {
        arr[i] = chars[charIndex + 1];
        return arr.join("");
      } else {
        arr[i] = chars[0];
        i--;
      }
    }
    // If all chars rolled over, prepend the first char
    return chars[0] + arr.join("");
  }
}
