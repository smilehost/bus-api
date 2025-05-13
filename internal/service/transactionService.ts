// path: internal/service/transactionService.ts
import { TransactionRepository } from "../repository/transactionRepository";
import { CompanyRepository } from "../repository/companyRepository";
import { AppError } from "../utils/appError";
import { PrismaClient } from "@prisma/client";

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async create(com_id: number, payload: any) {
    const company = await this.companyRepository.getById(com_id);
    if (!company) throw AppError.NotFound("Company not found");

    const prisma = new PrismaClient();

    const existingMember = await prisma.member.findFirst({
      where: {
        member_phone: String(payload.member_phone),
        member_com_id: com_id,
      },
    });

    let member_id = existingMember?.member_id;

    if (!member_id) {
      const member = await prisma.member.create({
        data: {
          member_phone: String(payload.member_phone),
          member_date: new Date().toISOString(),
          member_com_id: com_id,
        },
      });
      member_id = member.member_id;
    }

    const transactionData = {
      transaction_com_id: com_id,
      transaction_date_time: new Date().toISOString(),
      transaction_lat: payload.transaction_lat,
      transaction_long: payload.transaction_long,
      transaction_payment_method_id: payload.transaction_payment_method_id,
      transaction_amount: payload.transaction_amount,
      transaction_pax: payload.transaction_pax,
      transaction_member_id: member_id,
    };

    return this.transactionRepository.createTransactionWithTickets({
      transaction: transactionData,
      tickets: payload.tickets,
    });
  }
}
