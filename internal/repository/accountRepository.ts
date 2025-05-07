import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { Account } from "../../cmd/models"; // หรือใช้จาก prisma ก็ได้

export class AccountRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number): Promise<Account[]> {
    try {
      return await this.prisma.account.findMany({
        where: {
          account_com_id: comId,
        },
        orderBy: {
          account_id: "desc",
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}