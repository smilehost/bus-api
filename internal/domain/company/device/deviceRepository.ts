import { PrismaClient, company, device } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { autoInjectable } from "tsyringe";

@autoInjectable()
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
  ): Promise<(company & { devices: device[] })[]> {
    try {
      const whereConditions: any = {
        device_com_id: comId,
      };
  
      if (search && search.trim()) {
        whereConditions.OR = [
          { device_serial_number: { contains: search.toUpperCase() } },
        ];
      }
  
      if (typeof status === "number") {
        whereConditions.device_status = status;
      }
  
      // Fetch devices including full company object
      const devices = await this.prisma.device.findMany({
        skip,
        take,
        where: whereConditions,
        include: {
          company: true,
        },
        orderBy: {
          device_id: "desc",
        },
      });
  
      const companyMap = new Map<number, (company & { devices: device[] })>();

      for (const device of devices) {
        const { company, ...cleanDevice } = device;
        const comId = company.com_id;
  
        if (!companyMap.has(comId)) {
          companyMap.set(comId, {
            ...company,
            devices: [cleanDevice],
          });
        } else {
          companyMap.get(comId)!.devices.push(cleanDevice);
        }
      }
      
      return Array.from(companyMap.values());
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

  async findBySerialNumber(serialNumber: string) {
    try {
      return await this.prisma.device.findUnique({ 
        where: { device_serial_number: serialNumber },
      });
    } catch (error) {
      throw AppError.fromPrismaError(error);
    }
  }

  async getCompanyDevicePin(com_id:number){
    try {
      return await this.prisma.company_detail.findFirst({
        where: { company_detail_com_id:com_id },
        select:{
          company_detail_pin_device:true
        }
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
