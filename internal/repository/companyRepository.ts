import { PrismaClient } from "@prisma/client";
import { Company } from "../../cmd/models"; // หรือจะใช้จาก Prisma model โดยตรงก็ได้ เช่น `prisma.company`

export class CompanyRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number) {
    return this.prisma.company.findMany({
      where: {
        com_id: comId,
      },
    });
  }

  async getById(comId: number) {
    return this.prisma.company.findUnique({
      where: {
        com_id: comId,
      },
    });
  }

  async update(comId: number, data: Company) {
    return this.prisma.company.update({
      where: {
        com_id: comId,
      },
      data,
    });
  }

  async delete(comId: number) {
    return this.prisma.company.delete({
      where: {
        com_id: comId,
      },
    });
  }
}
