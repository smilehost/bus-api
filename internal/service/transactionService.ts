import { TransactionRepository } from "../repository/transactionRepository";
import { CompanyRepository } from "../repository/companyRepository";
import { MemberRepository } from "../repository/memberRepository";
import {
  CreateTicketDto,
  CreateTransactionDto,
  CreateTransactionTicketsDto,
  ShiftingRemainDto,
} from "../../cmd/dto";
import { AppError } from "../utils/appError";
import { member, route_ticket, ticket, transaction } from "@prisma/client";
import { TicketRemainService } from "./ticketRemainService";
import { PaymentMethodService } from "./paymentMethodService";

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly memberRepository: MemberRepository,
    private readonly ticketRemainService: TicketRemainService,
    private readonly PaymentMethodService: PaymentMethodService,
  ) {}

  async create(com_id: number, payload: CreateTransactionTicketsDto) {
    const company = await this.companyRepository.getById(com_id);
    if (!company) throw AppError.NotFound("Company not found");

    const newTransaction: CreateTransactionDto = {
      transaction_lat: payload.transaction_lat,
      transaction_long: payload.transaction_long,
      transaction_payment_method_id: payload.transaction_payment_method_id,
      transaction_device_id: payload.transaction_device_id,
      transaction_note: payload.transaction_note,
      transaction_amount: payload.transaction_amount,
      transaction_pax: payload.transaction_pax,
      transaction_route_id: payload.transaction_route_id,
      transaction_ticket_discount_id: payload.transaction_ticket_discount_id,
      transaction_member_id: null,
      transaction_com_id: 1,
      transaction_status: "PENDING",
      transaction_date_time: new Date(),
    };

    let newMember: member | null = null;
    if (payload.member_phone) {
      newMember = {
        member_id: 0,
        member_com_id: com_id,
        member_date_time: new Date(),
        member_phone: payload.member_phone,
      };
    }

    //const newTickets = await this.createTickets(com_id, payload.tickets);
    const transaction = await this.transactionRepository.makeTransaction(
      newTransaction,
      newMember
    );

    const urlWebView = this.PaymentMethodService.getPaymentWebviewLink(
      transaction.transaction_id,
      transaction.transaction_payment_method_id,
      Number(transaction.transaction_amount)
    )

    return {
      ...transaction,
      url_web_view:urlWebView
    }
  }

  async confirmAndPrint(comId: number, transactionId: number,newTickets:CreateTicketDto[], slipImage: any) {
    if (slipImage || slipImage.buffer) {
      this.saveSilp(comId,slipImage,transactionId)
    }

    await this.createTickets(comId,transactionId,newTickets) 
    await this.decreaseRemain(newTickets)
    return await this.transactionRepository.getTicketByTransactionId(transactionId)
  }

  private async createTickets(com_id: number,transactionId:number, tickets: CreateTicketDto[]) {
    const ticketsData: ticket[] = [];
    const ticketGroups: Record<string, CreateTicketDto[]> = {};

    for (const t of tickets) {
      const dateStr = t.ticket_date;
      if (!ticketGroups[dateStr]) {
        ticketGroups[dateStr] = [];
      }
      ticketGroups[dateStr].push(t);
    }

    for (const [date, tickets] of Object.entries(ticketGroups)) {
      const prefix = this.getPrefix(com_id, date);
      let nextSuffix = "0000"; // default starting point
      const latest = await this.transactionRepository.getLastTicket(prefix);
      if (latest) {
        nextSuffix = latest.ticket_uuid.split("-")[2];
      }

      for (const ticket of tickets) {
        nextSuffix = this.incrementAlphaNum(nextSuffix);
        const newTicket = {
          ...ticket,
          ticket_status: "active",
          ticket_date: date,
          ticket_transaction_id:transactionId,
          ticket_uuid: `${prefix}-${nextSuffix}`,
        } as ticket;

        ticketsData.push(newTicket);
      }
    }

    return await this.transactionRepository.createTikcets(ticketsData);
  }

  async checkingByPolling(com_id: number, transactionId: number) {
    const transaction = await this.transactionRepository.getById(transactionId);
    if (!transaction) throw AppError.NotFound("Not fond transaction");
    if (transaction.transaction_com_id != com_id) {
      throw AppError.Forbidden("com_id Not match");
    }

    const status = transaction.transaction_status;
    if (status != "COMPLETE") {
      return {
        status: status,
        transaction: {},
      };
    }

    return {
      status: status,
      transaction: transaction,
    };
  }

  async transactionCallbackGateWay(transactionId: number, status: string){
    await this.transactionCallback(transactionId,status)
    return "ok"
  }

  async transactionCallbackStatic(transactionId: number, status: string){
    await this.transactionCallback(transactionId,status)
    return "ok"
  }

  private async transactionCallback(transaction_id: number, status: string) {
    if (status === "Cancelled") {
      await this.transactionRepository.changeStatusById(
        transaction_id,
        "CANCELED"
      );
    }

    if (status === "Success") {
      await this.transactionRepository.changeStatusById(
        transaction_id,
        "COMPLETE"
      );
    }
  }

  private getPrefix(com_id: number, travelDate: string) {
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
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const arr = input.split("");

    for (let i = arr.length - 1; i >= 0; i--) {
      const index = chars.indexOf(arr[i]);
      if (index < chars.length - 1) {
        arr[i] = chars[index + 1];
        return arr.join("");
      } else {
        arr[i] = chars[0];
      }
    }

    return chars[0] + arr.join(""); // prepend if overflow
  }

  private async decreaseRemain(tickets:CreateTicketDto[]) {

    for (const ticket of tickets) {
      const routeTicket = await this.transactionRepository.getRouteTicketById(
        ticket.ticket_route_ticket_id
      );
      if (!routeTicket) throw AppError.NotFound("routeTicket Not fond");

      this.ticketRemainService.decreaseTicketRemain({
        date: ticket.ticket_date,
        time: ticket.ticket_time,
        routeTicketId: routeTicket.route_ticket_id,
        maxTicket: routeTicket.route_ticket_amount,
      } as ShiftingRemainDto);
    }
  }

  private async saveSilp(comId:number,slipImage:any,transactionId:number){
    const path = require('path');
    const fs = require('fs').promises;
    const fsSync = require('fs');

    // Create directory structure: SilpImages/comId/year/month/days/
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    // Create timestamp for filename
    const timestamp = currentDate.getTime();
    const fileExtension = slipImage.originalname.split('.').pop() || 'jpg';
    const fileName = `${timestamp}_${transactionId}.${fileExtension}`;
    
    // Create directory path
    const dirPath = path.join('SilpImages', String(comId), String(year), month, day);
    const filePath = path.join(dirPath, fileName);

    try {
      if (!fsSync.existsSync(dirPath)) {
        fsSync.mkdirSync(path.resolve(dirPath), { recursive: true });
      }
      await fs.writeFile(path.resolve(filePath), slipImage.buffer);
      
      return filePath
    } catch (error: any) {
      console.error("Error saving slip image:", error);
      const errorMessage = error.message || 'Unknown error';
      throw AppError.Internal(`Failed to save slip image: ${errorMessage}`);
    }
  }
}
