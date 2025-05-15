// path: internal/repository/companyRepository.ts
import { company, PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";

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

  async getByName(com_name: string) {
    try {
      return await this.prisma.company.findFirst({
        where: { com_name },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: company) {
    try {
      return await this.prisma.company.create({
        data: {
          com_prefix: data.com_prefix,
          com_name: data.com_name,
          com_status: data.com_status,
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(com_id: number, data: company) {
    try {
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
