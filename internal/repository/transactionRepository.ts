// path: internal/repository/transactionRepository.ts
import { member, PrismaClient, transaction } from "@prisma/client";
import { AppError } from "../utils/appError";
import { CreateTransactionDto } from "../../cmd/dto";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // async createAllInOneTransaction(
  //   com_id: number,
  //   payload: CreateTransactionDto
  // ) {
  //   try {
  //     return await this.prisma.$transaction(async (tx) => {
  //       // 1. สร้าง member ใหม่เสมอ

  //       // 2. สร้าง transaction
  //       const transaction = await tx.transaction.create({
  //         data: {
  //           transaction_com_id: com_id,
  //           transaction_date_time: new Date(),
  //           transaction_lat: payload.transaction_lat,
  //           transaction_long: payload.transaction_long,
  //           transaction_payment_method_id:
  //             payload.transaction_payment_method_id,
  //           transaction_amount: payload.transaction_amount,
  //           transaction_pax: payload.transaction_pax,
  //           transaction_member_id: member.member_id,
  //           transaction_route_id:payload.transaction_route_id,
  //           transaction_ticket_discount_id:
  //             payload.transaction_ticket_discount_id,
  //         },
  //       });

  //       // 3. เตรียม tickets
  //       const ticketData = payload.tickets.map((t) => ({
  //         ticket_transaction_id: transaction.transaction_id,
  //         ticket_date: new Date().toISOString(),
  //         ticket_time: t.ticket_time,
  //         ticket_type: t.ticket_type,
  //         ticket_price: t.ticket_price,
  //         ticket_status: "active",
  //         ticket_uuid: crypto.randomUUID(),
  //       }));
      
  //       // 4. สร้าง tickets
  //       await tx.ticket.createMany({
  //         data: ticketData,
  //       });

  //       return {
  //         transaction,
  //         tickets: ticketData,
  //       };
  //     });
  //   } catch (error) {
  //     throw AppError.fromPrismaError(error);
  //   }
  // }

  async getLastTicket(prefix:string){
    try {
      return await this.prisma.ticket.findFirst({
        where: {
          ticket_uuid: {
            startsWith: prefix,
          },
        },
        orderBy: {
          ticket_uuid: 'desc',
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }

  }
}

