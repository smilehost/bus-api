import { PrismaClient, device } from "@prisma/client";
import { AppError } from "../utils/appError";

export class DeviceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(comId: number) {
    try {
      return await this.prisma.device.findMany({
        where: {
          device_com_id: comId,
        },
        orderBy: {
          device_id: "desc",
        },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getPaginated(
    comId: number,
    skip: number,
    take: number,
    search?: string,
    status?: number
  ): Promise<[device[], number]> {
    try {
      const whereConditions: any = {
        device_com_id: comId,
      };

      if (search && search.trim()) {
        whereConditions.OR = [ 
          { device_serial_number: { contains: search.toUpperCase() } },
        ];
      }

      if (typeof(status) === "number") {
        whereConditions.device_status = status;
      }

      const [data, total] = await this.prisma.$transaction([
        this.prisma.device.findMany({
          skip,
          take,
          where: whereConditions,
          orderBy: { device_id: "desc" },
        }),
        this.prisma.device.count({ where: whereConditions }),
      ]);

      return [data, total];
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async create(data:Omit<device,"device_id">) {
    try {
      return await this.prisma.device.create({
        data:data
      });
    } catch (error) {
      console.log(error)
      throw AppError.fromPrismaError(error);
    }
  }

  async getById(deviceId: number) {
    try {
      return await this.prisma.device.findUnique({
        where: { device_id: deviceId },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async update(deviceId: number, data: Partial<device>) {
    try {
      // Ensure device_com_id is not accidentally changed if present in data
      const { device_com_id, ...updateData } = data; 
      return await this.prisma.device.update({
        where: { device_id: deviceId },
        data: updateData,
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async delete(deviceId: number) {
    try {
      return await this.prisma.device.delete({
        where: { device_id: deviceId },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async changeStatus(deviceId: number, status: number) {
    try {
      return await this.prisma.device.update({
        where: { device_id: deviceId },
        data: { device_status: status },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }
}
