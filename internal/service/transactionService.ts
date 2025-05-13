import { TransactionRepository } from "../repository/transactionRepository";
import { CompanyRepository } from "../repository/companyRepository";
import { CreateTransactionDto } from "../../cmd/dto";
import { AppError } from "../utils/appError";

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async create(com_id: number, payload: CreateTransactionDto) {

    const company = await this.companyRepository.getById(com_id);
    if (!company) throw AppError.NotFound("Company not found");
    
    return this.transactionRepository.createAllInOneTransaction(com_id, payload);
  }
}