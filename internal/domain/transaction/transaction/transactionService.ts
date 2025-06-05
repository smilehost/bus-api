

import {
  CreateTicketDto,
  CreateTransactionDto,
  CreateTransactionTicketsDto,
  ShiftingRemainDto,
} from "../../../../cmd/dto";
import { AppError } from "../../../utils/appError";
import { member, route_ticket, transaction } from "@prisma/client"; // Removed 'ticket'
import { TicketRemainService } from "../ticketRemain/ticketRemainService";
import { TicketService } from "../ticket/ticketService"; // Added TicketService import
import { CompanyRepository } from "../../company/company/companyRepository";
import { TransactionRepository } from "./transactionRepository";
import { PaymentMethodService } from "../../payment/payment/paymentMethodService";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly ticketRemainService: TicketRemainService,
    private readonly PaymentMethodService: PaymentMethodService,
    private readonly ticketService: TicketService // Added TicketService
  ) {}

  async create(com_id: number, payload: CreateTransactionTicketsDto) {
    const company = await this.companyRepository.getById(com_id);
    if (!company) throw AppError.NotFound("Company not found");

    let discount = payload.transaction_ticket_discount_id
    if(discount){
      if(discount<0) discount = null
    } 

    const routeTicket = await this.transactionRepository.getRouteTicketById(payload.route_ticket_id)
    if (!routeTicket) throw AppError.NotFound("route ticket not found");

    const remain:ShiftingRemainDto = {
      date: payload.ticket_date,
      time: payload.ticket_time,
      routeTicketId: routeTicket.route_ticket_id,
      maxTicket: routeTicket.route_ticket_amount,
      amount: payload.transaction_pax,
    } 

    const newTransaction: CreateTransactionDto = {
      transaction_lat: payload.transaction_lat,
      transaction_long: payload.transaction_long,
      transaction_payment_method_id: payload.transaction_payment_method_id,
      transaction_device_id: payload.transaction_device_id,
      transaction_note: payload.transaction_note,
      transaction_amount: payload.transaction_amount,
      transaction_pax: payload.transaction_pax,
      transaction_route_id: payload.transaction_route_id,
      transaction_ticket_discount_id:discount,
      transaction_member_id: null,
      transaction_com_id: 1,
      transaction_status: "PENDING",
      transaction_date_time: new Date(),
      transaction_ticket_remain_id: this.ticketRemainService.endcodeTicketRemainId(remain)
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

    const transaction = await this.transactionRepository.makeTransaction(
      newTransaction,
      newMember
    );

    const urlWebView = await this.PaymentMethodService.getPaymentWebviewLink(
      transaction.transaction_id,
      transaction.transaction_payment_method_id,
      Number(transaction.transaction_amount)
    );

    await this.ticketRemainService.decreaseTicketRemain(remain);

    return {
      ...transaction,
      url_web_view: urlWebView,
    };
  }

  async confirmAndPrint(
    comId: number,
    transactionId: number,
    newTickets: CreateTicketDto[],
    slipImage: any
  ) {
    if (slipImage !== undefined) {
      await this.saveSilp(comId, slipImage, transactionId);
    }

    const createdTickets = await this.ticketService.createTicketsForTransaction(
      comId,
      transactionId,
      newTickets
    );

    return createdTickets;
  }

  async checkingByPolling(com_id: number, transactionId: number) {
    const transaction = await this.transactionRepository.getById(transactionId);
    if (!transaction) throw AppError.NotFound("Not fond transaction");
    if (transaction.transaction_com_id != com_id) {
      throw AppError.Forbidden("com_id Not match");
    }

    const status = transaction.transaction_status;
    if (status === "SUCCESS") {
      return {
        status: status,
        transaction: transaction,
      };
    }
    return {
      status: status,
      transaction: {},
    };
  }

  async transactionCallbackGateWay(transactionId: number, status: string) {
    await this.transactionCallback(transactionId, status);
    return "ok";
  }

  async transactionCallbackStatic(transactionId: number, status: string) {
    await this.transactionCallback(transactionId, status);
    return "ok";
  }

  private async transactionCallback(transaction_id: number, status: string) {
    if (status === "CANCELLED") {
      await this.cancelTransaction(transaction_id)
    }

    if (status === "SUCCESS") {
      await this.transactionRepository.changeStatusById(
        transaction_id,
        "SUCCESS"
      );
    }
  }

  async checkTransactionsTimeout(){
    const timeout = 5 * 60 * 1000
    const transactions = await this.transactionRepository.getTransactionsByStatus("PENDING")
    for (const transaction of transactions){
      const now = new Date();
      const start = new Date(transaction.transaction_date_time);

      const timeDiff = Math.abs(now.getTime() - start.getTime()); // in ms

      if (timeDiff <= timeout) {
        continue
      }

      await this.cancelTransaction(transaction.transaction_id)
    }
  }

  async cancelTransaction(transaction_id:number){
    const transaction = await this.transactionRepository.getById(transaction_id)

    console.log(transaction!.transaction_ticket_remain_id!)
    const remain = this.ticketRemainService.decodeTicketRemainId(transaction!.transaction_ticket_remain_id!)
    const routeTicket = await this.transactionRepository.getRouteTicketById(remain.routeTicketId)

    remain.amount = transaction!.transaction_pax
    remain.maxTicket = routeTicket!.route_ticket_amount
    await this.ticketRemainService.increaseTicketRemain(remain)

    await this.transactionRepository.changeStatusById(
      transaction_id,
      "CANCELLED"
    );
  }

  async getTransactionPositions(comId:number){
    return await this.transactionRepository.getTransactionPositions(comId)
  }

  private async saveSilp(comId: number, slipImage: any, transactionId: number) {
    const path = require("path");
    const fs = require("fs").promises;
    const fsSync = require("fs");

    // Create directory structure: SilpImages/comId/year/month/days/
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    // Create timestamp for filename
    const timestamp = currentDate.getTime();
    const fileExtension = slipImage.originalname.split(".").pop() || "jpg";
    const fileName = `${timestamp}_${transactionId}.${fileExtension}`;

    // Create directory path
    const dirPath = path.join(
      "SilpImages",
      String(comId),
      String(year),
      month,
      day
    );
    const filePath = path.join(dirPath, fileName);

    if (!fsSync.existsSync(dirPath)) {
      fsSync.mkdirSync(path.resolve(dirPath), { recursive: true });
    }
    await fs.writeFile(path.resolve(filePath), slipImage.buffer);

    return filePath;
  }
}
