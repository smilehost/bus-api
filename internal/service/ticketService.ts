import { TicketRepository } from "../repository/ticketRepository";

export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}
}
