// path: internal/repository/transactionRepository.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";

export class TransactionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createTransactionWithTickets(data: {
    transaction: {
      transaction_com_id: number;
      transaction_date_time: string;
      transaction_lat: string;
      transaction_long: string;
      transaction_payment_method_id: number;
      transaction_amount: string;
      transaction_pax: number;
      transaction_member_id: number;
    };
    tickets: {
      ticket_time: string;
      ticket_type: string;
      ticket_price: string;
    }[];
  }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
          data: data.transaction,
        });

        const ticketData = data.tickets.map((t) => ({
          ticket_transaction_id: transaction.transaction_id,
          ticket_date: new Date().toISOString().split("T")[0],
          ticket_time: t.ticket_time,
          ticket_type: t.ticket_type,
          ticket_price: t.ticket_price,
          ticket_status: "active",
          ticket_uuid: crypto.randomUUID(),
        }));

        const tickets = await tx.ticket.createMany({ data: ticketData });

        return {
          transaction,
          tickets: ticketData,
        };
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
