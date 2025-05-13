import { account, PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";

export class AccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number): Promise<account[]> {
    try {
      return await this.prisma.account.findMany({
        where: { account_com_id: comId },
        orderBy: { account_id: "desc" },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(id: number): Promise<account | null> {
    try {
      return await this.prisma.account.findUnique({
        where: { account_id: id },
      });
    } catch (error) {
      console.log(error);

      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: Partial<account>) {
    try {
      return await this.prisma.account.update({
        where: { account_id: id },
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.account.delete({
        where: { account_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
