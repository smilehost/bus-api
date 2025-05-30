import { PrismaClient } from "@prisma/client";

export class ReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getPaymentSummary(comId: number, start: Date, end: Date) {
    const payments = await this.prisma.payment_method.findMany({
      where: { com_id: comId },
    });

    const result: any[] = [];

    let fullPriceTotal = 0;
    let cancelTotalAmount = 0;
    let cancelTotalCount = 0;

    for (const method of payments) {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          transaction_com_id: comId,
          transaction_payment_method_id: method.payment_method_id,
          transaction_date_time: { gte: start, lte: end },
        },
        include: {
          tickets: true,
        },
      });

      let full_price = 0;
      let cancel_amount = 0;
      let cancel_total = 0;

      transactions.forEach((tran) => {
        tran.tickets.forEach((ticket) => {
          const price = parseFloat(ticket.ticket_price);
          full_price += price;

          if (ticket.ticket_status === "CANCELLED") {
            cancel_amount++;
            cancel_total += price;
          }
        });
      });

      fullPriceTotal += full_price;
      cancelTotalAmount += cancel_total;
      cancelTotalCount += cancel_amount;

      result.push({
        [method.payment_method_type]: {
          full_price: full_price.toFixed(0),
          cancel_ticket: {
            amount: cancel_amount,
            total: cancel_total.toFixed(0),
          },
          total_price: (full_price - cancel_total).toFixed(0),
        },
      });
    }

    result.unshift({
      total: {
        full_price: fullPriceTotal.toFixed(0),
        cancel_ticket: {
          amount: cancelTotalCount,
          total: cancelTotalAmount.toFixed(0),
        },
        total_price: (fullPriceTotal - cancelTotalAmount).toFixed(0),
      },
    });

    return result;
  }
}