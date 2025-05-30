import { PrismaClient } from "@prisma/client";

export class ReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getPaymentMethods(comId: number) {
    return this.prisma.payment_method.findMany({
      where: { com_id: comId },
    });
  }

  async getTransactionsByMethod(
    comId: number,
    methodId: number,
    start: Date,
    end: Date
  ) {
    return this.prisma.transaction.findMany({
      where: {
        transaction_com_id: comId,
        transaction_payment_method_id: methodId,
        transaction_date_time: { gte: start, lte: end },
      },
      include: {
        tickets: true,
      },
    });
  }
}
