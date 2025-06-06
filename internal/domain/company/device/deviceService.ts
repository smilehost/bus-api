import { device } from "@prisma/client"; // Added import for device type
import { AppError } from "../../../utils/appError";
import { DeviceRepository } from "./deviceRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
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
      data:data[0]
    };
  }
  

  async getById(deviceId: number) {
    const device = await this.deviceRepository.getById(deviceId);
    if (!device) {
      throw AppError.NotFound("Device not found");
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

  async update( deviceId: number, data: Partial<device>) {
    const existingDevice = await this.deviceRepository.getById(deviceId);
    if (!existingDevice) {
      throw AppError.NotFound("Device not found");
    }


    if (data.device_com_id && data.device_com_id !== existingDevice.device_com_id) {
        throw AppError.BadRequest("Cannot change company ID of a device.");
    }
    
    const { device_com_id, ...updateData } = data;

    return this.deviceRepository.update(deviceId, updateData);
  }

  async delete(deviceId: number) {
    const existingDevice = await this.deviceRepository.getById(deviceId);
    if (!existingDevice) {
      throw AppError.NotFound("Device not found");
    }
    return this.deviceRepository.delete(deviceId);
  }

  async changeStatus(deviceId: number, status: number) {
    const existingDevice = await this.deviceRepository.getById(deviceId);
    if (!existingDevice) {
      throw AppError.NotFound("Device not found");
    }
    return this.deviceRepository.changeStatus(deviceId, status);
  }

  async verifyDeviceBySerialNumber(com_id:number,serialNumber: string): Promise<device | null> {
    const device = await this.deviceRepository.findBySerialNumber(serialNumber);
    if (!device) {
      return null;
    }
    if (device.device_status !== 1) {
      return null; 
    }

    if (device.device_com_id !== Number(com_id)){
      return null
    }
    return device;
  }

  async getDeviceId(com_id:number,device: device){

    const pin = await this.deviceRepository.getCompanyDevicePin(com_id)
    return {
      device_id:device.device_id,
      // device_pin:pin
      device_pin: "123456" // Mock ตัวใหญ่ๆ ----------------------------------------------------------------------------------------------
    };
  }
}
