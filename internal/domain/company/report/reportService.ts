
import dayjs from "dayjs";
import { autoInjectable } from "tsyringe";
import { CompanyRepository } from "../company/companyRepository";
import { ReportRepository } from "./reportRepository";

@autoInjectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async getPaymentReport(comId: number, choice: number, date: string) {
    let startDate: Date, endDate: Date;

    const choiceStr = choice.toString();

    switch (choiceStr) {
      case "1": {
        const now = dayjs();
        startDate = now.startOf("day").toDate();
        endDate = now.endOf("day").toDate();
        break;
      }
      case "2": {
        const base = dayjs(date);
        startDate = base.startOf("week").toDate();
        endDate = base.endOf("week").toDate();
        break;
      }
      case "3": {
        const base = dayjs(date);
        startDate = base.startOf("month").toDate();
        endDate = base.endOf("month").toDate();
        break;
      }
      case "4": {
        const base = dayjs(date);
        startDate = base.startOf("year").toDate();
        endDate = base.endOf("year").toDate();
        break;
      }
      case "5": {
        const base = dayjs(date);
        startDate = base.startOf("day").toDate();
        endDate = base.endOf("day").toDate();
        break;
      }
      default:
        throw new Error("Invalid choice");
    }

    const payments = await this.reportRepository.getPaymentMethods(comId);
    const paymentMethodResult: any[] = [];

    let fullPriceTotal = 0;
    let cancelTotalAmount = 0;
    let cancelTotalCount = 0;

    for (const method of payments) {
      const transactions = await this.reportRepository.getTransactionsByMethod(
        comId,
        method.payment_method_id,
        startDate,
        endDate
      );

      let full_price = 0;
      let cancel_amount = 0;
      let cancel_total = 0;

      for (const tran of transactions) {
        for (const ticket of tran.tickets) {
          const price =
            parseFloat(ticket.ticket_price) - ticket.ticket_discount_price;
          full_price += price;

          if (ticket.ticket_status === "CANCELLED") {
            cancel_amount++;
            cancel_total += price;
          }
        }
      }
      console.log("full_price:", full_price);
      console.log(typeof full_price);

      fullPriceTotal += full_price;
      cancelTotalAmount += cancel_total;
      cancelTotalCount += cancel_amount;

      paymentMethodResult.push({
        payment_method_name: method.payment_method_name,
        full_price: full_price.toFixed(2),
        cancel_ticket: {
          amount: cancel_amount,
          total: cancel_total.toFixed(2),
        },
        total_price: (full_price - cancel_total).toFixed(2),
      });
    }

    return {
      total: {
        full_price: fullPriceTotal.toFixed(2),
        cancel_ticket: {
          amount: cancelTotalCount,
          total: cancelTotalAmount.toFixed(2),
        },
        total_price: (fullPriceTotal - cancelTotalAmount).toFixed(2),
      },
      payment_method: paymentMethodResult,
    };
  }
}
