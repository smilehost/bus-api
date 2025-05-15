import { TransactionRepository } from "../repository/transactionRepository";
import { CompanyRepository } from "../repository/companyRepository";
import { MemberRepository } from "../repository/memberRepository";
import { CreateTicketDto, CreateTransactionDto, CreateTransactionTicketsDto } from "../../cmd/dto";
import { AppError } from "../utils/appError";
import { member, ticket, transaction } from "@prisma/client";
import { TicketRemainService } from "./ticketRemainService";

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly memberRepository: MemberRepository,
    private readonly ticketRemainService: TicketRemainService,
  ) {}

  async create(com_id: number, payload: CreateTransactionTicketsDto) {

    const company = await this.companyRepository.getById(com_id);
    if (!company) throw AppError.NotFound("Company not found");


    const newTransaction:CreateTransactionDto = {
      transaction_com_id: com_id,
      transaction_date_time: new Date(),
      transaction_lat: payload.transaction_lat,
      transaction_long: payload.transaction_long,
      transaction_payment_method_id:
        payload.transaction_payment_method_id,
      transaction_amount: payload.transaction_amount,
      transaction_pax: payload.transaction_pax,
      transaction_member_id: null,
      transaction_route_id:payload.transaction_route_id,
      transaction_ticket_discount_id:
        payload.transaction_ticket_discount_id,
      transaction_status:"incomplete"
    } 

    if(payload.member_phone){
      const newMember:member = {
        member_id:0,
        member_com_id:com_id,
        member_date_time:new Date(),
        member_phone:payload.member_phone
      }
      const member = await this.memberRepository.create(newMember)
      newTransaction.transaction_member_id = member.member_id
    }

    const newTickets = await this.createTickets(com_id,payload.tickets) 
    
    //return this.transactionRepository.createAllInOneTransaction(com_id, payload);
  }


  private async createTickets(com_id:number,tickets:CreateTicketDto[]){
    const ticketsData:CreateTicketDto[] = []
    const ticketGroups: Record<string, CreateTicketDto[]> = {};

    for (const t of tickets) {
      const dateStr = t.ticket_date
      if (!ticketGroups[dateStr]) {
        ticketGroups[dateStr] = [];
      }
      ticketGroups[dateStr].push(t);
    }

    for (const [date, tickets] of Object.entries(ticketGroups)){
      const prefix = this.getPrefix(com_id, date);
      let nextSuffix = '0000'; // default starting point
      const latest = await this.transactionRepository.getLastTicket(prefix)
      if (latest){
        nextSuffix = latest.ticket_uuid.split('-')[2]
      }

      for (const ticket of tickets){
        
        nextSuffix = this.incrementAlphaNum(nextSuffix);
        ticketsData.push({
        ticket_date: new Date().toISOString(),
        ticket_time: ticket.ticket_time,
        ticket_type: ticket.ticket_type,
        ticket_price: ticket.ticket_price,
        ticket_status: "active",
        ticket_discount_price:ticket.ticket_discount_price,
        ticket_location_start:ticket.ticket_location_start,
        ticket_location_stop:ticket.ticket_location_stop,
        ticket_uuid:`${prefix}-${nextSuffix}`,
        } as CreateTicketDto)
      }
    }
  }

  private getPrefix(com_id: number, travelDate: string){
    const date = new Date(travelDate)
    const mmyy = date.toLocaleDateString('en-GB', {
      month: '2-digit',
      year: '2-digit',
    }).replace('/', '');

    return `${com_id}-${mmyy}`;
  }

  private incrementAlphaNum(input: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const arr = input.split('');
  
    for (let i = arr.length - 1; i >= 0; i--) {
      const index = chars.indexOf(arr[i]);
      if (index < chars.length - 1) {
        arr[i] = chars[index + 1];
        return arr.join('');
      } else {
        arr[i] = chars[0];
      }
    }
  
    return chars[0] + arr.join(''); // prepend if overflow
  }
}
