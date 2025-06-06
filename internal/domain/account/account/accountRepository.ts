import { account, PrismaClient } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { autoInjectable } from "tsyringe";

@autoInjectable()
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

  async getPaginated(
    comId: number,
    account_role:string,
    skip: number,
    take: number,
    search: string,
    status: number | null
  ): Promise<[account[], number]> {
    try {
      const where: any = {
        ...(account_role === "2" && { account_com_id: comId }),
        ...(search.trim()
          ? {
              OR: [
                { account_username: { contains: search.toLowerCase() } },
                { account_name: { contains: search.toLowerCase() } },
              ],
            }
          : {}),
        ...(typeof status === "number"
          ? { account_status: status }
          : {}),
      };
      if (account_role === "1") {
        where.account_role = "2";
      } else if (account_role === "2") {
        where.account_role = {
          notIn: ["1", "2"],
        };
      }

      const [data, total] = await this.prisma.$transaction([
        this.prisma.account.findMany({
          skip,
          take,
          where,
          orderBy: { account_id: "desc" },
        }),
        this.prisma.account.count({ where }),
      ]);

      return [data, total];
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
