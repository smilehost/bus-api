// path: internal/service/companyService.ts
import { company } from "@prisma/client";
import { CompanyRepository } from "../repository/companyRepository";
import { AppError } from "../utils/appError";

export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async getAll() {
    return this.companyRepository.getAll();
  }

  async getById(com_id: number) {
    const company = await this.companyRepository.getById(com_id);
    if (!company) {
      throw AppError.NotFound("Company not found");
    }
    return company;
  }

  async create(data: company) {
    const existing = await this.companyRepository.getByName(data.com_name);
    if (existing) {
      throw AppError.Conflict("Company already exists");
    }
    return this.companyRepository.create(data);
  }

  async update(com_id: number, data: company) {
    const existing = await this.companyRepository.getById(com_id);
    if (!existing) {
      throw AppError.NotFound("Company not found");
    }
    return this.companyRepository.update(com_id, data);
  }

  async delete(com_id: number) {
    const existing = await this.companyRepository.getById(com_id);
    if (!existing) {
      throw AppError.NotFound("Company not found");
    }
    return this.companyRepository.delete(com_id);
  }
}
