import { CompanyRepository } from "../repository/companyRepository";
import { ReportRepository } from "../repository/reportRepository";
import { Util } from "../utils/util";
import dayjs from "dayjs";

export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async getPaymentReport(comId: number, choice: string, date: string) {
    let startDate: Date, endDate: Date;

    const now = dayjs(date || new Date());

    switch (choice) {
      case "1": // วันนี้
      case "5": // เลือกวัน
        startDate = now.startOf("day").toDate();
        endDate = now.endOf("day").toDate();
        break;
      case "2": // สัปดาห์นี้
        startDate = now.startOf("week").toDate();
        endDate = now.endOf("week").toDate();
        break;
      case "3": // เดือนนี้
        startDate = now.startOf("month").toDate();
        endDate = now.endOf("month").toDate();
        break;
      case "4": // ปีนี้
        startDate = now.startOf("year").toDate();
        endDate = now.endOf("year").toDate();
        break;
      default:
        throw new Error("Invalid choice");
    }

    return this.reportRepository.getPaymentSummary(comId, startDate, endDate);
  }
}
