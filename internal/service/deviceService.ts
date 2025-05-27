import { DeviceRepository } from "../repository/deviceRepository";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util"; // Added import for Util
import { device } from "@prisma/client"; // Added import for device type

export class DeviceService {
  constructor(private readonly deviceRepository: DeviceRepository) {}

  async getByPagination(    
    comId: number,
    page: number,
    size: number,
    search?: string, 
    status?: number 
  ) {
    const skip = (page - 1) * size;
    const take = size;
  
    const searchString = search ? search.toString() : "";
  
    const data = await this.deviceRepository.getPaginated(
      comId,
      skip,
      take,
      searchString,
      status
    );
  
    // Calculate total from all grouped device counts
    const total = data.reduce((acc, group) => acc + group.devices.length, 0);
  
    return {
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
      data, // List of { company, devices }
    };
  }
  

  async getById(comId: number, deviceId: number) {
    const device = await this.deviceRepository.getById(deviceId);
    if (!device) {
      throw AppError.NotFound("Device not found");
    }

    if (!Util.ValidCompany(comId, device.device_com_id)) {
      throw AppError.Forbidden("Device: Company ID does not match");
    }
    return device;
  }

  async create(comId: number, serialNumber:string) {

    const data:Omit<device,"device_id"> = {
      device_serial_number:serialNumber,
      device_status:1,
      device_com_id:comId
    }

    return this.deviceRepository.create(data);
  }

  async update(comId: number, deviceId: number, data: Partial<device>) {
    const existingDevice = await this.deviceRepository.getById(deviceId);
    if (!existingDevice) {
      throw AppError.NotFound("Device not found");
    }

    if (!Util.ValidCompany(comId, existingDevice.device_com_id)) {
      throw AppError.Forbidden("Device: Company ID does not match");
    }

    if (data.device_com_id && data.device_com_id !== existingDevice.device_com_id) {
        throw AppError.BadRequest("Cannot change company ID of a device.");
    }
    
    const { device_com_id, ...updateData } = data;

    return this.deviceRepository.update(deviceId, updateData);
  }

  async delete(comId: number, deviceId: number) {
    const existingDevice = await this.deviceRepository.getById(deviceId);
    if (!existingDevice) {
      throw AppError.NotFound("Device not found");
    }

    if (!Util.ValidCompany(comId, existingDevice.device_com_id)) {
      throw AppError.Forbidden("Device: Company ID does not match");
    }
    return this.deviceRepository.delete(deviceId);
  }

  async changeStatus(comId: number, deviceId: number, status: number) {
    const existingDevice = await this.deviceRepository.getById(deviceId);
    if (!existingDevice) {
      throw AppError.NotFound("Device not found");
    }

    if (!Util.ValidCompany(comId, existingDevice.device_com_id)) {
      throw AppError.Forbidden("Device: Company ID does not match");
    }
    return this.deviceRepository.changeStatus(deviceId, status);
  }
}
