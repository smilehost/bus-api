// path: internal/repository/companyRepository.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { Company } from "../../cmd/models";

export class CompanyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll() {
    try {
      return await this.prisma.company.findMany({
        orderBy: { com_id: "desc" },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(com_id: number) {
    try {
      return await this.prisma.company.findUnique({
        where: { com_id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(com_id: number, data: Company) {
    try {
      console.log("------------4");
      console.log(data);
      console.log("------------5");
      
      return await this.prisma.company.update({
        where: { com_id },
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(com_id: number) {
    try {
      return await this.prisma.company.delete({
        where: { com_id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
