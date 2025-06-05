import { member, PrismaClient } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getById(id: number) {
    try {
      return await this.prisma.member.findUnique({
        where: { member_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getAll(comId: number) {
    try {
      return await this.prisma.member.findMany({
        where: {
          member_com_id: comId,
        },
        orderBy: {
          member_id: "desc",
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data: member) {
    try {
      return await this.prisma.member.create({
        data: {
          member_com_id: data.member_com_id,
          member_phone: data.member_phone,
          member_date_time: new Date(),
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(id: number, data: member) {
    try {
      return await this.prisma.member.update({
        where: { member_id: id },
        data,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(id: number) {
    try {
      return await this.prisma.member.delete({
        where: { member_id: id },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
