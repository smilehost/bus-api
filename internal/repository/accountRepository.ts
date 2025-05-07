import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { Account } from "../../cmd/models";

export class AccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number): Promise<Account[]> {
    try {
      return await this.prisma.account.findMany({
        where: { account_com_id: comId },
        orderBy: { account_id: "desc" },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(id: number): Promise<Account | null> {
    try {
      return await this.prisma.account.findUnique({
        where: { account_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: Partial<Account>) {
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
